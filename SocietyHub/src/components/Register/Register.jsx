import React, { useContext, useEffect, useState } from 'react';
import axios from '../../axios';
import { useNavigate } from 'react-router-dom';

import * as Yup from 'yup';
import toast from 'react-hot-toast';
import UserContext from '../../context/UserContext';

// ─── Validation Schema ───────────────────────────────────────────────────────
const validationSchema = Yup.object({
  block: Yup.string()
    .max(1, 'Block must be at most 1 character')
    .matches(/^[A-Za-z]$/, 'Must be a single alphabet character')
    .required('Block is required'),
  houseNo: Yup.number()
    .typeError('House No must be a number')
    .min(1, 'House No must be greater than 0')
    .max(1000, 'House No must be less than 1000')
    .required('House No is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/,
      'Password must contain uppercase, lowercase, number & special character'
    )
    .required('Password is required'),
  societyId: Yup.string().required('Society ID is required'),
  email: Yup.string()
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      'Invalid email format'
    )
    .required('Email is required'),
  name: Yup.string()
    .matches(
      /^[a-zA-Z]+( [a-zA-Z]+)+$/,
      'Please enter your full name (first and last name required)'
    )
    .required('Full name is required'),
  phoneNo: Yup.string()
    .matches(/^\d{10}$/, 'Phone number must be exactly 10 digits')
    .required('Phone No is required'),
  phoneNo2: Yup.string()
    .transform((v) => (v === '' ? null : v))
    .matches(/^\d{10}$/, 'Phone number must be exactly 10 digits')
    .notRequired()
    .nullable(),
});

// ─── Step constants ──────────────────────────────────────────────────────────
const STEP = { FORM: 'form', OTP: 'otp', VERIFIED: 'verified' };

// ─── Register Component ───────────────────────────────────────────────────────
const Register = () => {
  const navigate = useNavigate();
  const { rolee } = useContext(UserContext);

  const [step, setStep] = useState(STEP.FORM);
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSending, setIsSending]   = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [otpError, setOtpError] = useState('');

  const [formData, setFormData] = useState({
    block: '', houseNo: '', password: '', societyId: '',
    email: '', role: 'user', name: '', phoneNo: '', phoneNo2: '',
  });

  // Redirect if already logged in
  useEffect(() => {
    if (rolee === 'admin' || rolee === 'user') navigate('/layout/Dashboard');
    else if (rolee === 'security') navigate('/layout/Visitor');
  }, [rolee, navigate]);

  const set = (field) => (e) => setFormData({ ...formData, [field]: e.target.value });

  // ── Step 1: Validate form → send OTP ────────────────────────────────────
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setFieldErrors({});

    try {
      await validationSchema.validate(formData, { abortEarly: false });
    } catch (err) {
      const errors = {};
      err.inner.forEach((e) => { errors[e.path] = e.message; });
      setFieldErrors(errors);
      return;
    }

    setIsSending(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_URL_BACKEND}/api/v1/users/send-otp`,
        { ...formData },
        { withCredentials: true }
      );
      toast.success('OTP sent! Check your email.');
      setStep(STEP.OTP);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to send OTP.');
    } finally {
      setIsSending(false);
    }
  };

  // ── Step 2: Verify OTP ───────────────────────────────────────────────────
  const handleVerifyOtp = async () => {
    setOtpError('');
    if (!otpValue || otpValue.length !== 6) {
      setOtpError('Please enter the 6-digit OTP.');
      return;
    }

    setIsVerifying(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_URL_BACKEND}/api/v1/users/verify-otp`,
        { email: formData.email, otp: otpValue, verifyOnly: true },
        { withCredentials: true }
      );
      toast.success('OTP verified! ✅');
      setStep(STEP.VERIFIED);
    } catch (err) {
      const msg = err?.response?.data?.message || 'Invalid OTP.';
      setOtpError(msg);
    } finally {
      setIsVerifying(false);
    }
  };

  // ── Step 3: Final registration ───────────────────────────────────────────
  const handleRegister = async () => {
    setIsRegistering(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_URL_BACKEND}/api/v1/users/complete-registration`,
        { email: formData.email },
        { withCredentials: true }
      );
      toast.success('Registration successful! 🎉');
      navigate('/Login');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Registration failed.');
    } finally {
      setIsRegistering(false);
    }
  };

  // ── Resend OTP ────────────────────────────────────────────────────────────
  const handleResend = async () => {
    setOtpError('');
    setIsSending(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_URL_BACKEND}/api/v1/users/send-otp`,
        { ...formData },
        { withCredentials: true }
      );
      toast.success('OTP resent! Check your email.');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to resend OTP.');
    } finally {
      setIsSending(false);
    }
  };

  // ── Shared input style ────────────────────────────────────────────────────
  const inputCls = 'w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200 text-sm';
  const errCls   = 'text-red-500 text-xs font-semibold mt-1 pl-1';

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4F7FE] font-raleway p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8 w-full max-w-2xl transition-all duration-300 hover:shadow-2xl overflow-y-auto max-h-[95vh]">
        <div className="text-center mb-5">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight">Create an Account</h1>
          <p className="text-gray-500 mt-1 text-sm font-medium">Join us and access your dashboard</p>
        </div>

        <form onSubmit={handleSendOtp} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

            {/* Block */}
            <div>
              <label className="block mb-1 text-sm font-semibold text-gray-700">Block</label>
              <input type="text" value={formData.block} onChange={set('block')}
                placeholder="e.g. A" className={inputCls} disabled={step !== STEP.FORM} />
              {fieldErrors.block && <p className={errCls}>{fieldErrors.block}</p>}
            </div>

            {/* House No */}
            <div>
              <label className="block mb-1 text-sm font-semibold text-gray-700">House No</label>
              <input type="text" value={formData.houseNo} onChange={set('houseNo')}
                placeholder="e.g. 101" className={inputCls} disabled={step !== STEP.FORM} />
              {fieldErrors.houseNo && <p className={errCls}>{fieldErrors.houseNo}</p>}
            </div>

            {/* Society ID */}
            <div>
              <label className="block mb-1 text-sm font-semibold text-gray-700">Society ID</label>
              <input type="text" value={formData.societyId} onChange={set('societyId')}
                placeholder="Society ID" className={inputCls} disabled={step !== STEP.FORM} />
              {fieldErrors.societyId && <p className={errCls}>{fieldErrors.societyId}</p>}
            </div>

            {/* Full Name */}
            <div>
              <label className="block mb-1 text-sm font-semibold text-gray-700">Full Name</label>
              <input type="text" value={formData.name} onChange={set('name')}
                placeholder="First Last" className={inputCls} disabled={step !== STEP.FORM} />
              {fieldErrors.name && <p className={errCls}>{fieldErrors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block mb-1 text-sm font-semibold text-gray-700">Email</label>
              <input type="text" value={formData.email} onChange={set('email')}
                placeholder="you@example.com" className={inputCls} disabled={step !== STEP.FORM} />
              {fieldErrors.email && <p className={errCls}>{fieldErrors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block mb-1 text-sm font-semibold text-gray-700">Password</label>
              <input type="password" value={formData.password} onChange={set('password')}
                placeholder="Password" className={inputCls} disabled={step !== STEP.FORM} />
              {fieldErrors.password && <p className={errCls}>{fieldErrors.password}</p>}
            </div>

            {/* Role */}
            <div>
              <label className="block mb-1 text-sm font-semibold text-gray-700">Role</label>
              <div className="relative">
                <select value={formData.role} onChange={set('role')}
                  className={`${inputCls} appearance-none cursor-pointer`} disabled={step !== STEP.FORM}>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="security">Security</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
            </div>

            {/* Admin Role Pass */}
            {formData.role === 'admin' && (
              <div>
                <label className="block mb-1 text-sm font-semibold text-gray-700">Role Pass</label>
                <input type="password" value={formData.rolePass || ''}
                  onChange={set('rolePass')} placeholder="Role Pass"
                  className={inputCls} disabled={step !== STEP.FORM} />
              </div>
            )}

            {formData.role === 'security' && navigate('/SecurityRegister')}
          
            {/* Phone No */}
            <div>
              <label className="block mb-1 text-sm font-semibold text-gray-700">Phone No</label>
              <input type="text" value={formData.phoneNo} onChange={set('phoneNo')}
                placeholder="10-digit number" className={inputCls} disabled={step !== STEP.FORM} />
              {fieldErrors.phoneNo && <p className={errCls}>{fieldErrors.phoneNo}</p>}
            </div>

            {/* Phone No 2 */}
            <div>
              <label className="block mb-1 text-sm font-semibold text-gray-700">Phone No 2 (Optional)</label>
              <input type="text" value={formData.phoneNo2} onChange={set('phoneNo2')}
                placeholder="10-digit number" className={inputCls} disabled={step !== STEP.FORM} />
              {fieldErrors.phoneNo2 && <p className={errCls}>{fieldErrors.phoneNo2}</p>}
            </div>
          </div>

          {/* ── Send OTP button (only in FORM step) ── */}
          {step === STEP.FORM && (
            <button type="submit" disabled={isSending}
              className="mt-2 w-full py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 shadow-sm hover:shadow-md transition-all duration-200 active:scale-[0.98] disabled:bg-blue-400">
              {isSending ? 'Sending OTP…' : 'Send OTP to Email'}
            </button>
          )}
        </form>

        {/* ── OTP section (inline, below form) ─────────────────────────── */}
        {(step === STEP.OTP || step === STEP.VERIFIED) && (
          <div className="mt-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
            {step === STEP.OTP && (
              <>
                <div className="mb-4">
                  <label className="block mb-1 text-sm font-semibold text-gray-700">Enter OTP</label>
                  <p className="text-xs text-gray-500 mb-2">
                    Sent to <span className="font-semibold text-gray-900">{formData.email}</span>. Valid for 5 minutes.
                  </p>
                  <input
                    type="text"
                    maxLength={6}
                    value={otpValue}
                    onChange={(e) => { setOtpValue(e.target.value.replace(/\D/g, '')); setOtpError(''); }}
                    onKeyDown={(e) => e.key === 'Enter' && handleVerifyOtp()}
                    placeholder="6-digit OTP"
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all tracking-[0.5em] text-center font-medium text-lg"
                  />
                  {otpError && (
                    <p className="text-red-500 text-xs font-semibold mt-1 pl-1">{otpError}</p>
                  )}
                </div>

                <button
                  onClick={handleVerifyOtp}
                  disabled={isVerifying}
                  className="w-full py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 shadow-sm hover:shadow-md transition-all duration-200 active:scale-[0.98] disabled:bg-blue-400">
                  {isVerifying ? 'Verifying…' : 'Verify OTP'}
                </button>

                <p className="text-center text-sm text-gray-500 mt-3">
                  Didn't receive it?{' '}
                  <button
                    onClick={handleResend}
                    disabled={isSending}
                    className="text-blue-600 font-medium hover:text-blue-700 hover:underline transition-colors disabled:opacity-50">
                    {isSending ? 'Resending…' : 'Resend OTP'}
                  </button>
                </p>
              </>
            )}

            {/* Verified state */}
            {step === STEP.VERIFIED && (
              <>
                <p className="text-sm text-gray-600 mb-3 text-center">
                  ✅ <span className="font-semibold text-gray-900">{formData.email}</span> verified. Click below to complete your registration.
                </p>
                <button
                  onClick={handleRegister}
                  disabled={isRegistering}
                  className="w-full py-2.5 rounded-xl bg-green-600 text-white font-medium hover:bg-green-700 shadow-sm hover:shadow-md transition-all duration-200 active:scale-[0.98] disabled:bg-green-400">
                  {isRegistering ? 'Registering…' : 'Complete Registration'}
                </button>
              </>
            )}
          </div>
        )}

        <div className="text-center mt-5">
          <p className="text-sm text-gray-600 font-medium">
            Already have an account?{' '}
            <a href="/login" className="text-blue-600 font-medium hover:text-blue-700 hover:underline transition-colors">Login here</a>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Register;