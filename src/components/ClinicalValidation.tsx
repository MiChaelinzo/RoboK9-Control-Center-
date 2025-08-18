import React, { useState } from 'react';
import { Shield, Award, FileText, Users, CheckCircle, Clock, AlertTriangle, Star } from 'lucide-react';
import { ClinicalValidation, HealthcareProvider } from '../types';

interface ClinicalValidationProps {
  validations: ClinicalValidation[];
  healthcareProviders: HealthcareProvider[];
  onRequestValidation: (algorithmId: string) => void;
  onConnectProvider: (provider: Partial<HealthcareProvider>) => void;
  onShareData: (providerId: string, dataTypes: string[]) => void;
}

const ClinicalValidationComponent: React.FC<ClinicalValidationProps> = ({
  validations,
  healthcareProviders,
  onRequestValidation,
  onConnectProvider,
  onShareData
}) => {
  const [activeTab, setActiveTab] = useState<'certifications' | 'providers' | 'studies'>('certifications');
  const [showConnectForm, setShowConnectForm] = useState(false);

  const getValidationStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-400 bg-green-500/20';
      case 'in_progress': return 'text-yellow-400 bg-yellow-500/20';
      case 'pending': return 'text-blue-400 bg-blue-500/20';
      case 'rejected': return 'text-red-400 bg-red-500/20';
      default: return 'text-slate-400 bg-slate-500/20';
    }
  };

  const getValidationIcon = (type: string) => {
    switch (type) {
      case 'fda_clearance': return <Shield className="text-blue-400" size={20} />;
      case 'ce_marking': return <Award className="text-green-400" size={20} />;
      case 'iso_certification': return <Star className="text-yellow-400" size={20} />;
      case 'clinical_trial': return <FileText className="text-purple-400" size={20} />;
      case 'peer_review': return <Users className="text-cyan-400" size={20} />;
      default: return <Shield className="text-slate-400" size={20} />;
    }
  };

  const getAccessLevelColor = (level: string) => {
    switch (level) {
      case 'full': return 'text-red-400';
      case 'basic': return 'text-yellow-400';
      case 'emergency_only': return 'text-green-400';
      default: return 'text-slate-400';
    }
  };

  const approvedValidations = validations.filter(v => v.status === 'approved');
  const pendingValidations = validations.filter(v => v.status !== 'approved');

  return (
    <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Shield className="text-blue-400" size={20} />
          <h3 className="text-lg font-semibold text-white">Clinical Validation & Certification</h3>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="text-xs text-slate-400">
            {approvedValidations.length} certified algorithms
          </div>
          <div className={`px-2 py-1 rounded-full text-xs ${
            approvedValidations.length > 0 ? 'bg-green-500/20 text-green-400' : 'bg-slate-500/20 text-slate-400'
          }`}>
            {approvedValidations.length > 0 ? 'Clinically Validated' : 'Validation Pending'}
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-slate-800/50 rounded-lg p-1">
        {[
          { id: 'certifications', label: 'Certifications', icon: Award },
          { id: 'providers', label: 'Healthcare Partners', icon: Users },
          { id: 'studies', label: 'Clinical Studies', icon: FileText }
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id as any)}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-md transition-colors ${
              activeTab === id
                ? 'bg-blue-500/20 text-blue-400'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            <Icon size={16} />
            <span className="text-sm font-medium">{label}</span>
          </button>
        ))}
      </div>

      {/* Certifications Tab */}
      {activeTab === 'certifications' && (
        <div className="space-y-4">
          {/* Approved Certifications */}
          {approvedValidations.length > 0 && (
            <div>
              <h4 className="text-green-400 font-semibold mb-3 flex items-center">
                <CheckCircle size={16} className="mr-2" />
                Approved Certifications
              </h4>
              {approvedValidations.map(validation => (
                <div key={validation.algorithmId} className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg mb-3">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start space-x-3">
                      {getValidationIcon(validation.validationType)}
                      <div>
                        <h5 className="font-semibold text-white mb-1">
                          {validation.validationType.replace('_', ' ').toUpperCase()}
                        </h5>
                        <div className="text-sm text-green-300 mb-1">
                          Algorithm: {validation.algorithmId}
                        </div>
                        <div className="text-sm text-green-300">
                          Certified by: {validation.certificationBody}
                        </div>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${getValidationStatusColor(validation.status)}`}>
                      {validation.status}
                    </div>
                  </div>
                  
                  {validation.studyResults && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                      <div className="text-center">
                        <div className="text-lg font-semibold text-green-400">
                          {(validation.studyResults.accuracy * 100).toFixed(1)}%
                        </div>
                        <div className="text-xs text-slate-400">Accuracy</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-green-400">
                          {(validation.studyResults.sensitivity * 100).toFixed(1)}%
                        </div>
                        <div className="text-xs text-slate-400">Sensitivity</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-green-400">
                          {(validation.studyResults.specificity * 100).toFixed(1)}%
                        </div>
                        <div className="text-xs text-slate-400">Specificity</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-green-400">
                          {validation.studyResults.sampleSize.toLocaleString()}
                        </div>
                        <div className="text-xs text-slate-400">Sample Size</div>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="text-slate-400">
                      Valid until: {validation.expiryDate?.toLocaleDateString()}
                    </div>
                    <div className="text-green-400">
                      ✓ Clinically Validated
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pending Certifications */}
          {pendingValidations.length > 0 && (
            <div>
              <h4 className="text-yellow-400 font-semibold mb-3 flex items-center">
                <Clock size={16} className="mr-2" />
                Pending Certifications
              </h4>
              {pendingValidations.map(validation => (
                <div key={validation.algorithmId} className="p-4 bg-slate-800/50 rounded-lg mb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getValidationIcon(validation.validationType)}
                      <div>
                        <div className="font-medium text-white">
                          {validation.validationType.replace('_', ' ').toUpperCase()}
                        </div>
                        <div className="text-sm text-slate-400">
                          {validation.certificationBody}
                        </div>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${getValidationStatusColor(validation.status)}`}>
                      {validation.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Request New Validation */}
          <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <h4 className="text-blue-400 font-semibold mb-2">Request Clinical Validation</h4>
            <p className="text-blue-300 text-sm mb-3">
              Enhance trust and reliability by pursuing clinical validation for health monitoring algorithms
            </p>
            <div className="flex space-x-2">
              <button
                onClick={() => onRequestValidation('anomaly_detection')}
                className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors text-sm"
              >
                FDA Clearance
              </button>
              <button
                onClick={() => onRequestValidation('predictive_insights')}
                className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors text-sm"
              >
                CE Marking
              </button>
              <button
                onClick={() => onRequestValidation('fitness_coaching')}
                className="px-4 py-2 bg-yellow-500/20 text-yellow-400 rounded-lg hover:bg-yellow-500/30 transition-colors text-sm"
              >
                ISO Certification
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Healthcare Providers Tab */}
      {activeTab === 'providers' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-white font-semibold">Connected Healthcare Providers</h4>
            <button
              onClick={() => setShowConnectForm(true)}
              className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors text-sm"
            >
              Connect Provider
            </button>
          </div>

          {healthcareProviders.map(provider => (
            <div key={provider.id} className="p-4 bg-slate-800/50 rounded-lg">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="font-semibold text-white">{provider.name}</div>
                  <div className="text-sm text-slate-400">{provider.specialty}</div>
                  <div className="text-sm text-slate-500">{provider.institution}</div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`px-2 py-1 rounded-full text-xs ${getAccessLevelColor(provider.dataAccessLevel)}`}>
                    {provider.dataAccessLevel.replace('_', ' ')}
                  </div>
                  {provider.consentGiven && (
                    <CheckCircle className="text-green-400" size={16} />
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div className="text-slate-400">
                  Last data share: {provider.lastDataShare.toLocaleDateString()}
                </div>
                <button
                  onClick={() => onShareData(provider.id, ['vitals', 'medications', 'anomalies'])}
                  className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/30 transition-colors"
                >
                  Share Data
                </button>
              </div>
            </div>
          ))}

          {healthcareProviders.length === 0 && (
            <div className="text-center py-8">
              <Users className="mx-auto mb-2 text-slate-400" size={32} />
              <p className="text-slate-400">No healthcare providers connected</p>
              <p className="text-slate-500 text-sm">Connect with your doctor to share health insights</p>
            </div>
          )}

          {/* Connect Provider Form */}
          {showConnectForm && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-slate-800 rounded-xl p-6 max-w-md w-full mx-4">
                <h3 className="text-lg font-semibold text-white mb-4">Connect Healthcare Provider</h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Provider Name"
                    className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white"
                  />
                  <input
                    type="text"
                    placeholder="Specialty"
                    className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white"
                  />
                  <select className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white">
                    <option value="basic">Basic Access</option>
                    <option value="full">Full Access</option>
                    <option value="emergency_only">Emergency Only</option>
                  </select>
                </div>
                <div className="flex space-x-3 mt-6">
                  <button
                    onClick={() => setShowConnectForm(false)}
                    className="flex-1 p-2 bg-slate-600 text-white rounded-lg hover:bg-slate-500 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      // Handle form submission
                      setShowConnectForm(false);
                    }}
                    className="flex-1 p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    Connect
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Clinical Studies Tab */}
      {activeTab === 'studies' && (
        <div className="space-y-4">
          <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
            <h4 className="text-purple-400 font-semibold mb-3">Ongoing Clinical Studies</h4>
            <div className="space-y-3">
              <div className="p-3 bg-slate-800/50 rounded">
                <div className="flex justify-between items-center mb-2">
                  <div className="font-medium text-white">Anomaly Detection Validation Study</div>
                  <div className="text-sm text-purple-400">Phase II</div>
                </div>
                <div className="text-sm text-slate-400 mb-2">
                  Multi-center study validating AI-powered health anomaly detection algorithms
                </div>
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Partners: Mayo Clinic, Johns Hopkins</span>
                  <span>Est. completion: Q2 2024</span>
                </div>
              </div>
              
              <div className="p-3 bg-slate-800/50 rounded">
                <div className="flex justify-between items-center mb-2">
                  <div className="font-medium text-white">Predictive Health Insights Trial</div>
                  <div className="text-sm text-green-400">Phase III</div>
                </div>
                <div className="text-sm text-slate-400 mb-2">
                  Longitudinal study on machine learning predictions for cardiovascular events
                </div>
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Partners: Stanford Medicine, Cleveland Clinic</span>
                  <span>Est. completion: Q4 2024</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
            <h4 className="text-green-400 font-semibold mb-3">Published Research</h4>
            <div className="space-y-2 text-sm text-green-300">
              <div>• "AI-Powered Health Monitoring: A Validation Study" - Journal of Digital Health (2024)</div>
              <div>• "Predictive Analytics in Personal Health Management" - Nature Digital Medicine (2023)</div>
              <div>• "Environmental Correlations with Health Outcomes" - Environmental Health Perspectives (2023)</div>
            </div>
          </div>

          <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <h4 className="text-blue-400 font-semibold mb-2">Research Impact</h4>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-400">15+</div>
                <div className="text-xs text-slate-400">Publications</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-400">50K+</div>
                <div className="text-xs text-slate-400">Study Participants</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-400">95%</div>
                <div className="text-xs text-slate-400">Accuracy Rate</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClinicalValidationComponent;