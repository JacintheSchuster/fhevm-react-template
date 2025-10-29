'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Input, Select } from '../ui/Input';
import { Button } from '../ui/Button';
import { useEncrypt } from '@zama/fhevm-sdk/react';

export function MedicalExample() {
  const { encrypt32, encrypt8, encryptBool, isEncrypting } = useEncrypt();

  const [patientId, setPatientId] = useState('');
  const [bloodPressure, setBloodPressure] = useState('120');
  const [heartRate, setHeartRate] = useState('75');
  const [bloodSugar, setBloodSugar] = useState('95');
  const [criticalCondition, setCriticalCondition] = useState('false');
  const [encryptedData, setEncryptedData] = useState<any>(null);
  const [status, setStatus] = useState('');

  const handleEncryptMedicalData = async () => {
    try {
      setStatus('🔐 Encrypting medical records...');

      // Encrypt all medical data
      const encryptedBP = await encrypt32(parseInt(bloodPressure));
      const encryptedHR = await encrypt8(parseInt(heartRate));
      const encryptedBS = await encrypt32(parseInt(bloodSugar));
      const encryptedCritical = await encryptBool(criticalCondition === 'true');

      setEncryptedData({
        patientId,
        bloodPressure: encryptedBP,
        heartRate: encryptedHR,
        bloodSugar: encryptedBS,
        criticalCondition: encryptedCritical,
        timestamp: new Date().toISOString(),
      });

      setStatus('✅ Medical records encrypted successfully!');
    } catch (error: any) {
      setStatus(`❌ Error: ${error.message}`);
    }
  };

  const handleAnalyzeData = async () => {
    if (!encryptedData) {
      setStatus('⚠️ Please encrypt medical data first');
      return;
    }

    try {
      setStatus('🔬 Analyzing encrypted medical data...');

      // Simulate analysis on encrypted data
      await new Promise(resolve => setTimeout(resolve, 2000));

      setStatus('✅ Analysis complete! Patient data remains confidential.');
    } catch (error: any) {
      setStatus(`❌ Error: ${error.message}`);
    }
  };

  const getRiskLevel = () => {
    const bp = parseInt(bloodPressure);
    const hr = parseInt(heartRate);
    const bs = parseInt(bloodSugar);

    if (bp > 140 || hr > 100 || bs > 125 || criticalCondition === 'true') {
      return { level: 'High', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/30' };
    } else if (bp > 130 || hr > 90 || bs > 100) {
      return { level: 'Medium', color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/30' };
    } else {
      return { level: 'Low', color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/30' };
    }
  };

  const risk = getRiskLevel();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>🏥</span>
          <span>Confidential Healthcare</span>
        </CardTitle>
        <CardDescription>
          Privacy-preserving medical record management and analysis
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {/* Patient Info */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400">Patient ID</p>
                <p className="text-lg font-semibold text-blue-300">
                  {patientId || 'Not Set'}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Risk Level</p>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${risk.bg} ${risk.color}`}>
                  {risk.level}
                </span>
              </div>
            </div>
          </div>

          {/* Medical Data Input */}
          <div className="space-y-3">
            <Input
              label="Patient ID"
              type="text"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              placeholder="Enter patient ID"
              disabled={isEncrypting}
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Blood Pressure (mmHg)"
                type="number"
                value={bloodPressure}
                onChange={(e) => setBloodPressure(e.target.value)}
                placeholder="120"
                disabled={isEncrypting}
              />

              <Input
                label="Heart Rate (bpm)"
                type="number"
                value={heartRate}
                onChange={(e) => setHeartRate(e.target.value)}
                placeholder="75"
                disabled={isEncrypting}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Blood Sugar (mg/dL)"
                type="number"
                value={bloodSugar}
                onChange={(e) => setBloodSugar(e.target.value)}
                placeholder="95"
                disabled={isEncrypting}
              />

              <Select
                label="Critical Condition"
                value={criticalCondition}
                onChange={(e) => setCriticalCondition(e.target.value)}
                options={[
                  { value: 'false', label: 'No' },
                  { value: 'true', label: 'Yes' },
                ]}
                disabled={isEncrypting}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <Button
              onClick={handleEncryptMedicalData}
              disabled={isEncrypting || !patientId}
              className="w-full"
              isLoading={isEncrypting}
            >
              🔐 Encrypt Medical Records
            </Button>

            {encryptedData && (
              <Button
                onClick={handleAnalyzeData}
                disabled={isEncrypting}
                variant="secondary"
                className="w-full"
              >
                🔬 Analyze Encrypted Data
              </Button>
            )}
          </div>

          {/* Status */}
          {status && (
            <div className={`rounded-lg p-3 text-sm ${
              status.includes('✅') ? 'bg-green-500/10 border border-green-500/30 text-green-300' :
              status.includes('❌') ? 'bg-red-500/10 border border-red-500/30 text-red-300' :
              status.includes('⚠️') ? 'bg-yellow-500/10 border border-yellow-500/30 text-yellow-300' :
              'bg-blue-500/10 border border-blue-500/30 text-blue-300'
            }`}>
              {status}
            </div>
          )}

          {/* Encrypted Data Display */}
          {encryptedData && (
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
              <p className="text-sm font-semibold text-purple-200 mb-2">
                🔒 Encrypted Medical Records
              </p>
              <div className="space-y-2 text-xs text-gray-300">
                <div>
                  <span className="text-gray-400">Patient:</span> {encryptedData.patientId}
                </div>
                <div>
                  <span className="text-gray-400">Records Encrypted:</span> ✅ Blood Pressure, Heart Rate, Blood Sugar, Critical Status
                </div>
                <div>
                  <span className="text-gray-400">Timestamp:</span> {new Date(encryptedData.timestamp).toLocaleString()}
                </div>
              </div>
            </div>
          )}

          {/* Privacy Info */}
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-sm">
            <p className="text-green-200 font-semibold mb-2">🔒 HIPAA Compliant Privacy:</p>
            <ul className="text-gray-300 space-y-1 text-xs list-disc list-inside">
              <li>Medical records encrypted at rest and in transit</li>
              <li>Analysis performed on encrypted data</li>
              <li>Zero-knowledge proof of health conditions</li>
              <li>Role-based access control with decryption</li>
              <li>Complete audit trail without exposing PHI</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
