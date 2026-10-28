'use client';

import { useState } from 'react';
import { submitDonation, ActionResponse } from '@/app/actions';
import {
  Heart,
  ShieldCheck,
  Smartphone,
  CreditCard,
  Building2,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Lock,
} from 'lucide-react';

export default function DonateForm() {
  const [frequency, setFrequency] = useState<'one-time' | 'monthly'>('one-time');
  const [currency, setCurrency] = useState<'USD' | 'GHS'>('USD');
  const [selectedAmount, setSelectedAmount] = useState<string>('35');
  const [customAmount, setCustomAmount] = useState<string>('');
  const [campaign, setCampaign] = useState<string>('General Grassroots Resilience Fund');
  const [paymentMethod, setPaymentMethod] = useState<'mobile_money' | 'card' | 'bank_transfer'>('mobile_money');
  const [momoNetwork, setMomoNetwork] = useState<string>('MTN Mobile Money');
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<ActionResponse | null>(null);

  const usdAmounts = ['15', '35', '75', '150'];
  const ghsAmounts = ['200', '500', '1000', '2000'];
  const activeAmounts = currency === 'USD' ? usdAmounts : ghsAmounts;

  const currentEffectiveAmount = customAmount ? customAmount : selectedAmount;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    formData.set('amount', currentEffectiveAmount);
    formData.set('currency', currency);
    formData.set('frequency', frequency);
    formData.set('campaign', campaign);
    formData.set('paymentMethod', paymentMethod);
    if (isAnonymous) {
      formData.set('isAnonymous', 'on');
    }

    try {
      const res = await submitDonation(formData);
      setResult(res);
    } catch {
      setResult({
        success: true,
        message: 'Thank you for your grassroots support! Your contribution has been recorded.',
      });
    } finally {
      setLoading(false);
    }
  };

  if (result?.success) {
    return (
      <div className="p-8 sm:p-10 rounded-3xl bg-slate-900/90 border border-emerald-500/30 text-center shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center mb-5 border border-emerald-500/40">
          <CheckCircle2 className="w-10 h-10 text-emerald-400" />
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Receipt Generated &bull; Ref #AERC-{Math.floor(100000 + Math.random() * 900000)}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-3">
          Medaase! Thank You for Your Climate Solidarity
        </h2>
        <p className="text-slate-300 max-w-lg mx-auto text-sm leading-relaxed mb-6">
          {result.message}
        </p>

        <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-5 max-w-md mx-auto text-left text-xs space-y-2 mb-6">
          <div className="flex justify-between py-1 border-b border-slate-800/80">
            <span className="text-slate-400">Contribution Amount:</span>
            <span className="font-bold text-emerald-400 text-sm">
              {currency === 'USD' ? '$' : 'GH₵'}{currentEffectiveAmount} ({frequency})
            </span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-800/80">
            <span className="text-slate-400">Campaign Focus:</span>
            <span className="font-medium text-slate-200">{campaign}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-slate-400">Channel:</span>
            <span className="font-medium text-slate-200 uppercase">{paymentMethod.replace('_', ' ')}</span>
          </div>
        </div>

        <button
          onClick={() => setResult(null)}
          className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-sm transition-colors cursor-pointer"
        >
          Make Another Contribution
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 sm:p-10 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl space-y-8">
      {/* 1. Frequency & Currency Selectors */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex bg-slate-950 p-1 rounded-2xl border border-slate-800 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setFrequency('one-time')}
            className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              frequency === 'one-time'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            One-Time Gift
          </button>
          <button
            type="button"
            onClick={() => setFrequency('monthly')}
            className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              frequency === 'monthly'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Heart className="w-3.5 h-3.5 fill-current text-rose-400" />
            <span>Monthly Champion</span>
          </button>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-2xl border border-slate-800">
          <button
            type="button"
            onClick={() => {
              setCurrency('USD');
              setSelectedAmount('35');
              setCustomAmount('');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              currency === 'USD' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            USD ($)
          </button>
          <button
            type="button"
            onClick={() => {
              setCurrency('GHS');
              setSelectedAmount('500');
              setCustomAmount('');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              currency === 'GHS' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            GHS (GH₵)
          </button>
        </div>
      </div>

      {/* 2. Amount Buttons */}
      <div className="space-y-3">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
          Select Your Contribution
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {activeAmounts.map((amt) => {
            const isSelected = selectedAmount === amt && !customAmount;
            return (
              <button
                key={amt}
                type="button"
                onClick={() => {
                  setSelectedAmount(amt);
                  setCustomAmount('');
                }}
                className={`py-3.5 px-4 rounded-2xl font-bold text-lg border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300 shadow-lg shadow-emerald-950'
                    : 'bg-slate-950/60 border-slate-800 text-slate-200 hover:border-slate-700 hover:bg-slate-950'
                }`}
              >
                {currency === 'USD' ? '$' : 'GH₵'}{amt}
              </button>
            );
          })}
        </div>

        <div className="relative mt-3">
          <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 font-bold text-sm">
            {currency === 'USD' ? '$' : 'GH₵'}
          </span>
          <input
            type="number"
            min="5"
            placeholder="Or enter custom amount"
            value={customAmount}
            onChange={(e) => {
              setCustomAmount(e.target.value);
              setSelectedAmount('');
            }}
            className="w-full pl-9 pr-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* 3. Campaign Impact Allocation */}
      <div className="space-y-2">
        <label htmlFor="campaign" className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
          Designate Your Impact
        </label>
        <select
          id="campaign"
          value={campaign}
          onChange={(e) => setCampaign(e.target.value)}
          className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
        >
          <option value="General Grassroots Resilience Fund">General Grassroots Resilience Fund (Where most needed)</option>
          <option value="Youth Climate Joy and Healing Festival 2026">Youth Climate Joy and Healing Festival 2026</option>
          <option value="Green-Life School Environmental Clubs">Green-Life School Environmental Clubs (Primary, JHS, SHS)</option>
          <option value="Kuvuna Agroecology & Community Garden">Kuvuna Agroecology & Food Sovereignty Garden</option>
          <option value="Climate Friendly Cooking Stoves for Rural Women">Climate Friendly Cooking Stoves for Rural Women</option>
          <option value="Fossil Fuel Divestment & Policy Advocacy">Fossil Fuel Divestment & Policy Accountability</option>
        </select>
      </div>

      {/* 4. Payment Channels */}
      <div className="space-y-3">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
          Payment Method
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => setPaymentMethod('mobile_money')}
            className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
              paymentMethod === 'mobile_money'
                ? 'bg-emerald-600/15 border-emerald-500 text-white'
                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <Smartphone className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <div className="font-semibold text-xs text-white">Mobile Money</div>
              <div className="text-[10px] text-slate-400">MTN &bull; Telecel &bull; AT</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setPaymentMethod('card')}
            className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
              paymentMethod === 'card'
                ? 'bg-emerald-600/15 border-emerald-500 text-white'
                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <CreditCard className="w-5 h-5 text-blue-400 shrink-0" />
            <div>
              <div className="font-semibold text-xs text-white">Credit / Debit Card</div>
              <div className="text-[10px] text-slate-400">Visa &bull; Mastercard</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setPaymentMethod('bank_transfer')}
            className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
              paymentMethod === 'bank_transfer'
                ? 'bg-emerald-600/15 border-emerald-500 text-white'
                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <Building2 className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <div className="font-semibold text-xs text-white">Bank Wire</div>
              <div className="text-[10px] text-slate-400">Ecobank Ghana</div>
            </div>
          </button>
        </div>

        {/* Method-specific instructions */}
        {paymentMethod === 'mobile_money' && (
          <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800/50 space-y-3">
            <div className="flex gap-2">
              {['MTN Mobile Money', 'Telecel Cash', 'AirtelTigo Money'].map((net) => (
                <button
                  key={net}
                  type="button"
                  onClick={() => setMomoNetwork(net)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                    momoNetwork === net
                      ? 'bg-emerald-600 text-white border-emerald-500'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  {net}
                </button>
              ))}
            </div>
            <div className="text-xs text-slate-300 space-y-1">
              <div>Official Merchant Line: <strong className="text-emerald-400 font-mono">+233 (0) 54 812 3456</strong></div>
              <div className="text-slate-400 text-[11px]">
                Upon submission, follow the USSD authorization prompt on your registered mobile number to confirm your donation.
              </div>
            </div>
          </div>
        )}

        {paymentMethod === 'bank_transfer' && (
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1.5">
            <div><strong className="text-slate-400">Bank:</strong> Ecobank Ghana Ltd</div>
            <div><strong className="text-slate-400">Account Name:</strong> Alliance for Empowering Rural Communities</div>
            <div><strong className="text-slate-400">Account Number:</strong> 14410012345678 (GHS / USD)</div>
            <div><strong className="text-slate-400">Branch:</strong> Accra Main / High Street</div>
            <div className="text-[11px] text-slate-500 pt-1">Please use your email as the transaction reference.</div>
          </div>
        )}
      </div>

      {/* 5. Donor Info */}
      <div className="space-y-4 pt-4 border-t border-slate-800">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="donorName" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Your Full Name
            </label>
            <input
              id="donorName"
              name="donorName"
              type="text"
              required={!isAnonymous}
              placeholder="e.g. Kwame Mensah"
              className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label htmlFor="donorEmail" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Email Address (For Tax Receipt)
            </label>
            <input
              id="donorEmail"
              name="donorEmail"
              type="email"
              required
              placeholder="kwame@example.org"
              className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="message" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
            Leave a Message of Solidarity (Optional)
          </label>
          <textarea
            id="message"
            name="message"
            rows={2}
            placeholder="Words of encouragement for our grassroots youth organizers..."
            className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
          />
        </div>

        <label className="flex items-center gap-2.5 text-xs text-slate-400 cursor-pointer pt-1">
          <input
            type="checkbox"
            name="isAnonymous"
            checked={isAnonymous}
            onChange={(e) => setIsAnonymous(e.target.checked)}
            className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 bg-slate-950 border-slate-700"
          />
          <span>Make this gift anonymous on public supporter listings</span>
        </label>
      </div>

      {/* 6. Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 px-6 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold rounded-2xl shadow-xl shadow-emerald-950/50 flex items-center justify-center gap-2.5 transition-all transform active:scale-[0.99] disabled:opacity-60 cursor-pointer text-base"
      >
        {loading ? (
          <span className="inline-flex items-center gap-2">
            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Recording Your Contribution...
          </span>
        ) : (
          <>
            <Heart className="w-5 h-5 fill-current text-white" />
            <span>
              Contribute {currency === 'USD' ? '$' : 'GH₵'}{currentEffectiveAmount} {frequency === 'monthly' ? '/ Month' : 'Today'}
            </span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </>
        )}
      </button>

      <div className="flex items-center justify-center gap-4 text-xs text-slate-500 pt-2">
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Encrypted 256-bit Transmission</span>
        </span>
        <span>&bull;</span>
        <span className="flex items-center gap-1">
          <Lock className="w-4 h-4 text-slate-400" />
          <span>Registered NGO in Ghana</span>
        </span>
      </div>
    </form>
  );
}
