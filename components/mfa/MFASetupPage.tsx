import React, { useState, useEffect } from 'react';
import { User } from '../../types';
import Card from '../common/Card';
import Button from '../common/Button';
import Input from '../common/Input';
import Label from '../common/Label';
import { useToast } from '../../hooks/useToast';
import { authApi } from '../../utils/api';

interface MFASetupPageProps {
  user: User;
  onComplete: (token: string) => void;
}

const MFASetupPage: React.FC<MFASetupPageProps> = ({ user, onComplete }) => {
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useToast();
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);

  useEffect(() => {
    // Request server to generate and store MFA secret, return QR code
    (async () => {
      try {
        const { data } = await authApi.mfaSetup(user.id);
        setSecret(data.secret);
        setQrCode(data.qrCode);
      } catch (e: any) {
        addToast({ type: 'error', message: e?.message || 'Failed to initialize MFA' });
      }
    })();
  }, [user.id, addToast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data } = await authApi.mfaVerify(user.id, otp, true);
      try { localStorage.setItem('token', data.token); } catch {}
      addToast({ type: 'success', message: 'MFA setup complete!' });
      onComplete(data.token);
    } catch (err: any) {
      addToast({ type: 'error', message: err?.message || 'Invalid OTP. Please enter a 6-digit code.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card title="Set Up Two-Factor Authentication" className="w-full max-w-md">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Scan the QR code with your authenticator app (e.g., Google Authenticator).</p>
          <div className="flex justify-center p-4 bg-white rounded-lg min-h-[220px] items-center">
            {qrCode ? (
              <img src={qrCode} alt="MFA QR Code" />
            ) : (
              <span className="text-sm text-muted-foreground">Generating QR code…</span>
            )}
          </div>
          {secret && (
            <p className="text-xs text-muted-foreground mt-2">
              Can't scan? Enter this secret key manually: <br />
              <strong className="font-mono">{secret}</strong>
            </p>
          )}
        </div>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <Label htmlFor="otp">Verification Code</Label>
            <Input
              type="text"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter 6-digit code"
              required
              maxLength={6}
              disabled={isLoading}
              className="text-center tracking-[0.5em]"
            />
          </div>
          <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
            {isLoading ? 'Verifying...' : 'Verify & Complete Setup'}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default MFASetupPage;
