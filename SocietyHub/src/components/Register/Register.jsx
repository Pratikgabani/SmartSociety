import React, { useContext, useEffect, useState } from 'react';
import axios from '../../axios';
import { useNavigate } from 'react-router-dom';
import building1 from './../../assets/Rectangle95.png';
import building2 from './../../assets/Rectangle97.jpg';
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
  const inputCls = 'w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 transition';
  const errCls   = 'text-red-500 text-xs mt-1';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 font-raleway">
      <div className="bg-white rounded-lg shadow-lg p-8 md:flex w-11/12 max-w-5xl">

        {/* ── Left: Form ─────────────────────────────────────────────────── */}
        <div className="md:w-1/2">
          <h1 className="text-3xl font-bold mb-6">Register</h1>

          <form onSubmit={handleSendOtp}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">

              {/* Block */}
              <div>
                <label className="block mb-1 font-semibold">Block</label>
                <input type="text" value={formData.block} onChange={set('block')}
                  placeholder="e.g. A" className={inputCls} disabled={step !== STEP.FORM} />
                {fieldErrors.block && <p className={errCls}>{fieldErrors.block}</p>}
              </div>

              {/* House No */}
              <div>
                <label className="block mb-1 font-semibold">House No</label>
                <input type="text" value={formData.houseNo} onChange={set('houseNo')}
                  placeholder="e.g. 101" className={inputCls} disabled={step !== STEP.FORM} />
                {fieldErrors.houseNo && <p className={errCls}>{fieldErrors.houseNo}</p>}
              </div>

              {/* Society ID */}
              <div>
                <label className="block mb-1 font-semibold">Society ID</label>
                <input type="text" value={formData.societyId} onChange={set('societyId')}
                  placeholder="Society ID" className={inputCls} disabled={step !== STEP.FORM} />
                {fieldErrors.societyId && <p className={errCls}>{fieldErrors.societyId}</p>}
              </div>

              {/* Full Name */}
              <div>
                <label className="block mb-1 font-semibold">Full Name</label>
                <input type="text" value={formData.name} onChange={set('name')}
                  placeholder="First Last" className={inputCls} disabled={step !== STEP.FORM} />
                {fieldErrors.name && <p className={errCls}>{fieldErrors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block mb-1 font-semibold">Email</label>
                <input type="text" value={formData.email} onChange={set('email')}
                  placeholder="you@example.com" className={inputCls} disabled={step !== STEP.FORM} />
                {fieldErrors.email && <p className={errCls}>{fieldErrors.email}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="block mb-1 font-semibold">Password</label>
                <input type="password" value={formData.password} onChange={set('password')}
                  placeholder="Password" className={inputCls} disabled={step !== STEP.FORM} />
                {fieldErrors.password && <p className={errCls}>{fieldErrors.password}</p>}
              </div>

              {/* Role */}
              <div>
                <label className="block mb-1 font-semibold">Role</label>
                <select value={formData.role} onChange={set('role')}
                  className={inputCls} disabled={step !== STEP.FORM}>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="security">Security</option>
                </select>
              </div>

              {/* Admin Role Pass */}
              {formData.role === 'admin' && (
                <div>
                  <label className="block mb-1 font-semibold">Role Pass</label>
                  <input type="password" value={formData.rolePass || ''}
                    onChange={set('rolePass')} placeholder="Role Pass"
                    className={inputCls} disabled={step !== STEP.FORM} />
                </div>
              )}

              {formData.role === 'security' && navigate('/SecurityRegister')}
            </div>

            {/* Phone No */}
            <div className="mb-4">
              <label className="block mb-1 font-semibold">Phone No</label>
              <input type="text" value={formData.phoneNo} onChange={set('phoneNo')}
                placeholder="10-digit number" className={inputCls} disabled={step !== STEP.FORM} />
              {fieldErrors.phoneNo && <p className={errCls}>{fieldErrors.phoneNo}</p>}
            </div>

            {/* Phone No 2 */}
            <div className="mb-4">
              <label className="block mb-1 font-semibold">Phone No 2 (Optional)</label>
              <input type="text" value={formData.phoneNo2} onChange={set('phoneNo2')}
                placeholder="10-digit number" className={inputCls} disabled={step !== STEP.FORM} />
              {fieldErrors.phoneNo2 && <p className={errCls}>{fieldErrors.phoneNo2}</p>}
            </div>

            {/* ── Send OTP button (only in FORM step) ── */}
            {step === STEP.FORM && (
              <button type="submit" disabled={isSending}
                className="mt-2 w-full py-2.5 rounded-lg text-white font-bold transition-all"
                style={{
                  background: isSending ? '#93c5fd' : 'linear-gradient(135deg,#1a56db,#4f86f7)',
                  cursor: isSending ? 'not-allowed' : 'pointer',
                  boxShadow: isSending ? 'none' : '0 4px 14px rgba(26,86,219,0.3)',
                }}>
                {isSending ? 'Sending OTP…' : ' Send OTP to Email'}
              </button>
            )}
          </form>

          {/* ── OTP section (inline, below form) ─────────────────────────── */}
          {(step === STEP.OTP || step === STEP.VERIFIED) && (
            <div className="mt-4">

              {step === STEP.OTP && (
                <>
                  <div className="mb-4">
                    <label className="block mb-1 font-semibold">Enter OTP</label>
                    <p className="text-xs text-gray-500 mb-2">
                      Sent to <span className="font-semibold text-gray-700">{formData.email}</span>. Valid for 5 minutes.
                    </p>
                    <input
                      type="text"
                      maxLength={6}
                      value={otpValue}
                      onChange={(e) => { setOtpValue(e.target.value.replace(/\D/g, '')); setOtpError(''); }}
                      onKeyDown={(e) => e.key === 'Enter' && handleVerifyOtp()}
                      placeholder="6-digit OTP"
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 transition tracking-widest text-center font-bold text-lg"
                    />
                    {otpError && (
                      <p className="text-red-500 text-xs mt-1">{otpError}</p>
                    )}
                  </div>

                  <button
                    onClick={handleVerifyOtp}
                    disabled={isVerifying}
                    className="mt-2 w-full py-2.5 rounded-lg text-white font-bold transition-all"
                    style={{
                      background: isVerifying ? '#93c5fd' : 'linear-gradient(135deg,#1a56db,#4f86f7)',
                      cursor: isVerifying ? 'not-allowed' : 'pointer',
                      boxShadow: isVerifying ? 'none' : '0 4px 14px rgba(26,86,219,0.3)',
                    }}>
                    {isVerifying ? 'Verifying…' : 'Verify OTP'}
                  </button>

                  <p className="text-center text-sm text-gray-500 mt-3">
                    Didn't receive it?{' '}
                    <button
                      onClick={handleResend}
                      disabled={isSending}
                      className="text-blue-600 font-bold hover:underline disabled:opacity-50">
                      {isSending ? 'Resending…' : 'Resend OTP'}
                    </button>
                  </p>
                </>
              )}

              {/* Verified state */}
              {step === STEP.VERIFIED && (
                <>
                  <p className="text-sm text-gray-500 mb-3">
                    ✅ <span className="font-semibold text-gray-700">{formData.email}</span> verified. Click below to complete your registration.
                  </p>
                  <button
                    onClick={handleRegister}
                    disabled={isRegistering}
                    className="mt-2 w-full py-2.5 rounded-lg text-white font-bold transition-all"
                    style={{
                      background: isRegistering ? '#93c5fd' : 'linear-gradient(135deg,#1a56db,#4f86f7)',
                      cursor: isRegistering ? 'not-allowed' : 'pointer',
                      boxShadow: isRegistering ? 'none' : '0 4px 14px rgba(26,86,219,0.3)',
                    }}>
                    {isRegistering ? 'Registering…' : 'Register'}
                  </button>
                </>
              )}
            </div>
          )}

          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <a href="/login" className="text-blue-600 font-bold hover:underline">Login</a>
            </p>
          </div>
        </div>

        {/* ── Right: Images ──────────────────────────────────────────────── */}
        <div className="hidden md:flex md:w-1/2 md:flex-col md:gap-4 md:pl-6">
          <img src={building1} alt="Building 1" className="rounded-lg mb-4 h-72 object-cover" />
          <img src={building2} alt="Building 2" className="rounded-lg h-72 object-cover" />
        </div>

      </div>
    </div>
  );
};

export default Register;