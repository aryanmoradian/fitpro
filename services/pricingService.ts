import { PlanDuration, SubscriptionTier, PendingPayment, PaymentMethod, PaymentStatus, AdminUserView, AdminStats, AdminAuditLog, SystemModule } from "../types";
import { APP_CONFIG } from "../config";
import { supabase } from "../lib/supabaseClient";

export interface PricingResult {
    baseUSD: number;
    discountedUSD: number;
    discountPercent: number;
    monthlyEquivalentUSD: number;
}

// NOTE: Rial conversion removed. USD only.

export const calculatePrice = (tier: SubscriptionTier, months: PlanDuration): PricingResult => {
    let monthlyRate = APP_CONFIG.PRICING.BASE[tier];
    
    if (months >= APP_CONFIG.PRICING.DISCOUNT_THRESHOLD_MONTHS) {
        if (tier === 'elite') monthlyRate = APP_CONFIG.PRICING.DISCOUNTED.elite;
        if (tier === 'elite_plus') monthlyRate = APP_CONFIG.PRICING.DISCOUNTED.elite_plus;
    }

    const totalUSD = monthlyRate * months;
    const baseTotal = APP_CONFIG.PRICING.BASE[tier] * months;
    const discountPercent = baseTotal > 0 ? Math.round(((baseTotal - totalUSD) / baseTotal) * 100) : 0;

    return {
        baseUSD: baseTotal,
        discountedUSD: parseFloat(totalUSD.toFixed(2)),
        discountPercent,
        monthlyEquivalentUSD: parseFloat((totalUSD / months).toFixed(2)),
    };
};

export const getWalletAddress = (): string => {
    return APP_CONFIG.WALLET.USDT_TRC20;
};

export const verifyTetherPayment = async (txid: string, expectedAmount: number): Promise<{ verified: boolean; message?: string }> => {
    try {
        const response = await fetch('/api/verifyPayment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ txid, expectedAmount })
        });
        
        const data = await response.json();
        return {
            verified: data.verified,
            message: data.message || (data.verified ? undefined : "تراکنش تایید نشد.")
        };
    } catch (error) {
        console.error("Payment verification error:", error);
        return { verified: false, message: "خطا در ارتباط با سرور." };
    }
};

export const uploadReceipt = async (file: File): Promise<{ success: boolean; url?: string }> => {
    try {
        const fileName = `${Date.now()}_${file.name}`;
        const { data, error } = await supabase.storage
            .from('receipts')
            .upload(fileName, file);

        if (error) throw error;

        const { data: publicUrlData } = supabase.storage
            .from('receipts')
            .getPublicUrl(fileName);

        return { success: true, url: publicUrlData.publicUrl };
    } catch (error) {
        console.error("Receipt upload error:", error);
        return { success: false };
    }
};

export const getPendingPayments = async (): Promise<PendingPayment[]> => {
    const { data, error } = await supabase
        .from('payments')
        .select('*')
        .or('status.eq.pending,status.eq.needs_review,status.eq.waiting')
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Error fetching payments:", error);
        return [];
    }

    return data.map((p: any) => ({
        id: p.id,
        userId: p.user_id,
        userName: p.user_name || 'Unknown',
        plan: p.plan,
        amount: p.amount_usd,
        method: p.method === 'USDT_TRC20' ? 'usdt_trc20' : 'manual',
        tx_id: p.tx_id,
        receipt_url: p.receipt_url,
        status: p.status,
        date: new Date(p.created_at).toLocaleDateString('fa-IR'),
        durationMonths: p.months_paid
    }));
};

export const submitManualPayment = async (payment: Omit<PendingPayment, 'id' | 'status' | 'date'>): Promise<{success: boolean}> => {
    let initialStatus: PaymentStatus = 'pending';
    if (payment.method === 'manual') initialStatus = 'waiting';

    const { error } = await supabase
        .from('payments')
        .insert({
            user_id: payment.userId,
            user_name: payment.userName,
            plan: payment.plan,
            amount_usd: payment.amount,
            method: payment.method === 'usdt_trc20' ? 'USDT_TRC20' : 'manual',
            receipt_url: payment.receipt_url,
            tx_id: payment.tx_id,
            months_paid: payment.durationMonths,
            status: initialStatus
        });

    if (error) {
        console.error("Error submitting payment:", error);
        throw error;
    }
    return { success: true };
};

export const updatePaymentStatus = async (id: string, status: 'succeeded' | 'failed'): Promise<{success: boolean}> => {
    const { error } = await supabase
        .from('payments')
        .update({ status: status === 'succeeded' ? 'succeeded' : 'failed' })
        .eq('id', id);

    if (error) {
        console.error("Error updating payment:", error);
        return { success: false };
    }
    
    return { success: true };
};

// --- SUBSCRIPTION LOGIC ---

export const activateSubscription = async (userId: string, tier: SubscriptionTier, months: number): Promise<void> => {
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + months);

    const { error } = await supabase
        .from('profiles')
        .update({ 
            subscription_tier: tier,
            subscription_status: 'active',
            subscription_expiry: expiresAt.toISOString()
        })
        .eq('id', userId);

    if(error) console.error("Activation failed:", error);
};

export const updateUserSubscription = async (userId: string, tier: SubscriptionTier, expiry?: string): Promise<void> => {
    const status = tier === 'free' ? 'inactive' : 'active';
    const { error } = await supabase
        .from('profiles')
        .update({ 
            subscription_tier: tier,
            subscription_expiry: expiry,
            subscription_status: status
        })
        .eq('id', userId);

    if (error) console.error("Error updating sub:", error);
};

export const deleteUser = async (userId: string): Promise<void> => {
    const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

    if (error) console.error("Error deleting user:", error);
};

export const getAdminAnalytics = async (): Promise<AdminStats> => {
    const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
    const { count: eliteCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).or('subscription_tier.eq.elite,subscription_tier.eq.elite_plus');
    const { count: pendingCount } = await supabase.from('payments').select('*', { count: 'exact', head: true }).eq('status', 'waiting');

    return {
        totalUsers: userCount || 0,
        eliteUsers: eliteCount || 0,
        monthlyRevenue: 0,
        pendingReviews: pendingCount || 0,
        activityData: [],
        moduleUsage: []
    };
};

export const getAuditLogs = async (): Promise<AdminAuditLog[]> => { return []; };
export const getSystemModules = async (): Promise<SystemModule[]> => { return []; };
export const toggleSystemModule = async (id: string, isEnabled: boolean): Promise<void> => { };
export const sendNotification = async (userId: string | null, message: string): Promise<boolean> => { return true; };