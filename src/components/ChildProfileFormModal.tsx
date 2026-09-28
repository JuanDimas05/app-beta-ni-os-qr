import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Heart, Shield, Sparkles, Check, UserCheck } from 'lucide-react';
import { ChildProfile, CommunicationNeed, SensorySensitivity, EmergencyContact, UserAccount } from '../types/tea';

interface ChildProfileFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (profile: ChildProfile) => void;
  initialProfile?: ChildProfile | null;
  currentParent?: UserAccount | null;
}

const COMMON_CALMING_SUGGESTIONS = [
  'Hablar con tono suave y pausado',
  'Ofrecer auriculares con cancelación de ruido',
  'No tocarlo sin avisar previamente',
  'Darle espacio sin acorralar',
  'Mostrar fotos o pictogramas de mamá / papá',
  'Caminar a paso constante a su lado'
];

const COMMON_AVOID_SUGGESTIONS = [
  'No sujetar los brazos con fuerza',
  'No gritarle ni hablar varias personas al mismo tiempo',
  'No obligarlo a mirar a los ojos',
  'Evitar destellos de luz o linternas'
];

export const ChildProfileFormModal: React.FC<ChildProfileFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialProfile,
  currentParent,
}) => {
  const [nickname, setNickname] = useState('');
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState<number>(6);
  const [photoUrl, setPhotoUrl] = useState('/src/assets/images/tea_calm_support_1790581774043.jpg');
  const [communicationType, setCommunicationType] = useState<CommunicationNeed>('no_verbal');
  const [communicationNotes, setCommunicationNotes] = useState('');
  const [sensoryTriggers, setSensoryTriggers] = useState<SensorySensitivity[]>(['ruidos_fuertes']);
  const [customSensoryNotes, setCustomSensoryNotes] = useState('');
  const [calmingTechniques, setCalmingTechniques] = useState<string[]>([]);
  const [newCalmingInput, setNewCalmingInput] = useState('');
  const [actionsToAvoid, setActionsToAvoid] = useState<string[]>([]);
  const [newAvoidInput, setNewAvoidInput] = useState('');
  const [favoriteComfortItem, setFavoriteComfortItem] = useState('');
  const [bloodType, setBloodType] = useState('O+');
  const [allergiesText, setAllergiesText] = useState('');
  const [medicationsText, setMedicationsText] = useState('');
  const [medicalAlertNotes, setMedicalAlertNotes] = useState('');
  const [privacyMode, setPrivacyMode] = useState<'publico_diario' | 'alerta_emergencia' | 'restringido'>('publico_diario');

  const [contacts, setContacts] = useState<EmergencyContact[]>([
    {
      id: 'contact_1',
      name: '',
      relationship: 'Mamá',
      phone: '',
      whatsapp: '',
      email: '',
      isPrimary: true
    }
  ]);

  useEffect(() => {
    if (initialProfile) {
      setNickname(initialProfile.nickname);
      setFullName(initialProfile.fullName || '');
      setAge(initialProfile.age);
      setPhotoUrl(initialProfile.photoUrl);
      setCommunicationType(initialProfile.communicationType);
      setCommunicationNotes(initialProfile.communicationNotes);
      setSensoryTriggers(initialProfile.sensoryTriggers);
      setCustomSensoryNotes(initialProfile.customSensoryNotes || '');
      setCalmingTechniques(initialProfile.calmingTechniques || []);
      setActionsToAvoid(initialProfile.actionsToAvoid || []);
      setFavoriteComfortItem(initialProfile.favoriteComfortItem || '');
      setBloodType(initialProfile.bloodType || 'O+');
      setAllergiesText((initialProfile.allergies || []).join(', '));
      setMedicationsText((initialProfile.medications || []).join(', '));
      setMedicalAlertNotes(initialProfile.medicalAlertNotes || '');
      setPrivacyMode(initialProfile.privacyMode);
      setContacts(initialProfile.emergencyContacts.length > 0 ? initialProfile.emergencyContacts : [
        {
          id: 'contact_1',
          name: '',
          relationship: 'Mamá',
          phone: '',
          whatsapp: '',
          email: '',
          isPrimary: true
        }
      ]);
    } else {
      // Default clean values
      setNickname('');
      setFullName('');
      setAge(6);
      setPhotoUrl('/src/assets/images/tea_calm_support_1790581774043.jpg');
      setCommunicationType('no_verbal');
      setCommunicationNotes('Comprende lenguaje sencillo. Si entra en crisis se desorienta y no contesta.');
      setSensoryTriggers(['ruidos_fuertes', 'multitudes']);
      setCustomSensoryNotes('Evitar ambientes con sirenas o música muy alta.');
      setCalmingTechniques(['Hablar con tono suave y pausado', 'Ofrecer auriculares canceladores']);
      setActionsToAvoid(['No sujetar de los brazos a la fuerza', 'No gritar']);
      setFavoriteComfortItem('Muñeco o juguete suave en su mochila');
      setBloodType('O+');
      setAllergiesText('');
      setMedicationsText('');
      setMedicalAlertNotes('');
      setPrivacyMode('publico_diario');
      setContacts([
        {
          id: 'c_' + Date.now(),
          name: currentParent?.name || '',
          relationship: currentParent?.role.includes('Papá') ? 'Papá' : 'Mamá',
          phone: currentParent?.phone || '',
          whatsapp: currentParent?.phone ? currentParent.phone.replace(/\s+/g, '') : '',
          email: currentParent?.email || '',
          isPrimary: true
        }
      ]);
    }
  }, [initialProfile, isOpen, currentParent]);

  if (!isOpen) return null;

  const toggleTrigger = (trigger: SensorySensitivity) => {
    if (sensoryTriggers.includes(trigger)) {
      setSensoryTriggers(sensoryTriggers.filter(t => t !== trigger));
    } else {
      setSensoryTriggers([...sensoryTriggers, trigger]);
    }
  };

  const addCalmingTechnique = (text: string) => {
    if (text.trim() && !calmingTechniques.includes(text.trim())) {
      setCalmingTechniques([...calmingTechniques, text.trim()]);
      setNewCalmingInput('');
    }
  };

  const removeCalmingTechnique = (index: number) => {
    setCalmingTechniques(calmingTechniques.filter((_, i) => i !== index));
  };

  const addAvoidAction = (text: string) => {
    if (text.trim() && !actionsToAvoid.includes(text.trim())) {
      setActionsToAvoid([...actionsToAvoid, text.trim()]);
      setNewAvoidInput('');
    }
  };

  const removeAvoidAction = (index: number) => {
    setActionsToAvoid(actionsToAvoid.filter((_, i) => i !== index));
  };

  const updateContact = (index: number, field: keyof EmergencyContact, value: string | boolean) => {
    const updated = [...contacts];
    updated[index] = { ...updated[index], [field]: value };
    setContacts(updated);
  };

  const addContact = () => {
    setContacts([
      ...contacts,
      {
        id: 'c_' + Date.now(),
        name: '',
        relationship: 'Familiar',
        phone: '',
        whatsapp: '',
        email: '',
        isPrimary: false
      }
    ]);
  };

  const removeContact = (index: number) => {
    if (contacts.length <= 1) return;
    setContacts(contacts.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim()) return;

    const allergiesArray = allergiesText
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const medsArray = medicationsText
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const profileData: ChildProfile = {
      id: initialProfile?.id || 'child_' + Date.now(),
      parentId: initialProfile?.parentId || currentParent?.id || 'parent_usr_current',
      nickname: nickname.trim(),
      fullName: fullName.trim() || undefined,
      age: Number(age) || 6,
      photoUrl,
      qrCodeId: initialProfile?.qrCodeId || `TEA-QR-${nickname.toUpperCase().slice(0, 4)}-${Math.floor(1000 + Math.random() * 9000)}`,
      privacyMode,
      isAlertActive: initialProfile?.isAlertActive || false,
      communicationType,
      communicationNotes: communicationNotes.trim(),
      sensoryTriggers,
      customSensoryNotes: customSensoryNotes.trim(),
      calmingTechniques,
      actionsToAvoid,
      favoriteComfortItem: favoriteComfortItem.trim(),
      emergencyContacts: contacts.filter(c => c.name.trim() && c.phone.trim()),
      bloodType,
      allergies: allergiesArray,
      medications: medsArray,
      medicalAlertNotes: medicalAlertNotes.trim(),
      createdAt: initialProfile?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSave(profileData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div>
            <h2 className="text-lg font-bold text-slate-900 font-display">
              {initialProfile ? 'Editar Perfil y Ficha de Emergencia' : 'Registrar Nuevo Perfil TEA'}
            </h2>
            <p className="text-xs text-slate-500">
              Información de protección y asistencia rápida para el código QR
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 max-h-[80vh] overflow-y-auto space-y-6">
          {/* Section 1: Identificación y Privacidad */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <Shield className="w-4 h-4 text-teal-600" />
              1. Identificación y Privacidad
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Nombre o Apodo Visible *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Mateo, Leo, Sofi"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                />
                <span className="text-[11px] text-slate-400 mt-0.5 block">
                  Por seguridad, recomendamos solo apodo o primer nombre.
                </span>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Nombre Completo (Opcional / Privado)
                </label>
                <input
                  type="text"
                  placeholder="Para uso legal o de policía"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Edad
                </label>
                <input
                  type="number"
                  min={1}
                  max={25}
                  value={age}
                  onChange={(e) => setAge(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                />
              </div>
            </div>

            {/* Avatar selector */}
            <div className="mt-4">
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Fotografía o Avatar de Identificación
              </label>
              <div className="flex items-center gap-3">
                <img
                  src={photoUrl}
                  alt="Vista previa"
                  className="w-14 h-14 rounded-xl object-cover border border-slate-200 shadow-xs"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setPhotoUrl('/src/assets/images/tea_calm_support_1790581774043.jpg')}
                    className="text-xs px-2.5 py-1.5 border border-slate-200 rounded-md hover:bg-slate-50 text-slate-700"
                  >
                    Icono Calmante
                  </button>
                  <button
                    type="button"
                    onClick={() => setPhotoUrl('/src/assets/images/tea_hero_family_1790581758877.jpg')}
                    className="text-xs px-2.5 py-1.5 border border-slate-200 rounded-md hover:bg-slate-50 text-slate-700"
                  >
                    Familia Suave
                  </button>
                  <button
                    type="button"
                    onClick={() => setPhotoUrl('/src/assets/images/tea_safety_band_1790581786243.jpg')}
                    className="text-xs px-2.5 py-1.5 border border-slate-200 rounded-md hover:bg-slate-50 text-slate-700"
                  >
                    Brazalete
                  </button>
                </div>
              </div>
            </div>

            {/* Nivel de Privacidad */}
            <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-xs font-semibold text-slate-800 block mb-1">
                Protocolo de Privacidad del Código QR:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <label className="flex items-start gap-2 p-2 bg-white rounded-lg border border-slate-200 cursor-pointer">
                  <input
                    type="radio"
                    name="privacyMode"
                    value="publico_diario"
                    checked={privacyMode === 'publico_diario'}
                    onChange={() => setPrivacyMode('publico_diario')}
                    className="mt-0.5 text-teal-600 focus:ring-teal-500"
                  />
                  <div>
                    <span className="font-medium text-slate-900 block">Modo Diario Seguro</span>
                    <span className="text-slate-500 text-[11px]">
                      Oculta apellidos y notas médicas confidenciales a menos que se active alerta.
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-2 p-2 bg-white rounded-lg border border-slate-200 cursor-pointer">
                  <input
                    type="radio"
                    name="privacyMode"
                    value="alerta_emergencia"
                    checked={privacyMode === 'alerta_emergencia'}
                    onChange={() => setPrivacyMode('alerta_emergencia')}
                    className="mt-0.5 text-teal-600 focus:ring-teal-500"
                  />
                  <div>
                    <span className="font-medium text-slate-900 block">Modo Auxilio Completo</span>
                    <span className="text-slate-500 text-[11px]">
                      Muestra inmediatamente datos de salud, alergias y contactos para rescate rápido.
                    </span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Section 2: Necesidades de Comunicación y Sensorial */}
          <div className="pt-2 border-t border-slate-100">
            <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-600" />
              2. Comunicación & Sensibilidad Sensorial
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Estilo de Comunicación Principal *
                </label>
                <select
                  value={communicationType}
                  onChange={(e) => setCommunicationType(e.target.value as CommunicationNeed)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 bg-white"
                >
                  <option value="no_verbal">No verbal (usa gestos, pictogramas o lenguaje no hablado)</option>
                  <option value="verbal_limitado">Verbal limitado (palabras sueltas o frases muy cortas)</option>
                  <option value="verbal_fluido">Verbal fluido (puede responder pero con sobrecarga en crisis)</option>
                  <option value="usa_pictogramas_pecs">Usa pictogramas / Sistema PECS</option>
                  <option value="usa_comunicador_caa">Usa comunicador digital / CAA (tableta o app)</option>
                  <option value="ecolalia">Presenta ecolalia (repite frases escuchadas)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Instrucciones Rápidas de Comprensión
                </label>
                <textarea
                  rows={2}
                  value={communicationNotes}
                  onChange={(e) => setCommunicationNotes(e.target.value)}
                  placeholder="Ej: Comprende si le hablas mirándolo de frente a su altura. No hacer preguntas compuestas."
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Desencadenantes Sensoriales (Marcar los que apliquen)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  {[
                    { id: 'ruidos_fuertes' as SensorySensitivity, label: 'Ruidos Fuertes / Sirenas' },
                    { id: 'luces_brillantes' as SensorySensitivity, label: 'Luces Brillantes / Flash' },
                    { id: 'contacto_fisico' as SensorySensitivity, label: 'Contacto Físico Repentino' },
                    { id: 'multitudes' as SensorySensitivity, label: 'Multitudes / Aglomeración' },
                    { id: 'olores_fuertes' as SensorySensitivity, label: 'Olores Fuertes' },
                    { id: 'texturas_ropa' as SensorySensitivity, label: 'Texturas / Ropa incómoda' },
                  ].map((item) => (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => toggleTrigger(item.id)}
                      className={`p-2 rounded-lg text-left border transition-colors flex items-center justify-between ${
                        sensoryTriggers.includes(item.id)
                          ? 'bg-amber-50 border-amber-300 text-amber-900 font-medium'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span>{item.label}</span>
                      {sensoryTriggers.includes(item.id) && <Check className="w-3.5 h-3.5 text-amber-600" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Cómo calmar al niño en situaciones de crisis */}
          <div className="pt-2 border-t border-slate-100">
            <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <Heart className="w-4 h-4 text-teal-600" />
              3. Protocolo de Calma y Manejo de Crisis
            </h3>

            {/* Técnicas de calma */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Qué SÍ hacer para calmar al niño (Pasos de asistencia)
                </label>
                
                {/* Sugerencias rápidas de 1 toque */}
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {COMMON_CALMING_SUGGESTIONS.map((sug) => (
                    <button
                      type="button"
                      key={sug}
                      onClick={() => addCalmingTechnique(sug)}
                      className="text-[11px] bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-700 px-2 py-0.5 rounded transition-colors"
                    >
                      + {sug}
                    </button>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCalmingInput}
                    onChange={(e) => setNewCalmingInput(e.target.value)}
                    placeholder="Escribe otra forma de calmar y pulsa Agregar"
                    className="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addCalmingTechnique(newCalmingInput);
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => addCalmingTechnique(newCalmingInput)}
                    className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-medium rounded-lg hover:bg-slate-200"
                  >
                    Agregar
                  </button>
                </div>

                {calmingTechniques.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {calmingTechniques.map((item, idx) => (
                      <li key={idx} className="flex items-center justify-between text-xs bg-emerald-50 text-emerald-900 px-2.5 py-1.5 rounded-lg border border-emerald-200">
                        <span>✓ {item}</span>
                        <button
                          type="button"
                          onClick={() => removeCalmingTechnique(idx)}
                          className="text-emerald-700 hover:text-emerald-900"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Acciones a Evitar */}
              <div className="pt-2">
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Qué NO hacer (Acciones que empeoran la desregulación)
                </label>

                <div className="flex flex-wrap gap-1.5 mb-2">
                  {COMMON_AVOID_SUGGESTIONS.map((sug) => (
                    <button
                      type="button"
                      key={sug}
                      onClick={() => addAvoidAction(sug)}
                      className="text-[11px] bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-700 px-2 py-0.5 rounded transition-colors"
                    >
                      + {sug}
                    </button>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newAvoidInput}
                    onChange={(e) => setNewAvoidInput(e.target.value)}
                    placeholder="Ej: No sujetarlo de las muñecas"
                    className="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addAvoidAction(newAvoidInput);
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => addAvoidAction(newAvoidInput)}
                    className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-medium rounded-lg hover:bg-slate-200"
                  >
                    Agregar
                  </button>
                </div>

                {actionsToAvoid.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {actionsToAvoid.map((item, idx) => (
                      <li key={idx} className="flex items-center justify-between text-xs bg-rose-50 text-rose-900 px-2.5 py-1.5 rounded-lg border border-rose-200">
                        <span>✕ {item}</span>
                        <button
                          type="button"
                          onClick={() => removeAvoidAction(idx)}
                          className="text-rose-700 hover:text-rose-900"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Objeto de Confort */}
              <div className="pt-2">
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Objeto de Confort o Apego (siempre consigo)
                </label>
                <input
                  type="text"
                  placeholder="Ej: Auriculares celestes en bolsillo lateral / Dinosaurio de peluche"
                  value={favoriteComfortItem}
                  onChange={(e) => setFavoriteComfortItem(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Contactos de Emergencia */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <Shield className="w-4 h-4 text-teal-600" />
                4. Contactos de Emergencia (Padres / Tutores)
              </h3>
              <button
                type="button"
                onClick={addContact}
                className="text-xs text-teal-700 font-semibold hover:text-teal-800 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Agregar contacto
              </button>
            </div>

            <div className="space-y-3">
              {contacts.map((contact, idx) => (
                <div key={contact.id || idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-700">
                      Contacto {idx + 1} {contact.isPrimary && '(Principal)'}
                    </span>
                    {contacts.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeContact(idx)}
                        className="text-rose-600 hover:text-rose-800 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Nombre *</label>
                      <input
                        type="text"
                        required
                        placeholder="Ej: Elena Ruiz"
                        value={contact.name}
                        onChange={(e) => updateContact(idx, 'name', e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Parentesco</label>
                      <select
                        value={contact.relationship}
                        onChange={(e) => updateContact(idx, 'relationship', e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md"
                      >
                        <option value="Mamá">Mamá</option>
                        <option value="Papá">Papá</option>
                        <option value="Tutor Legal">Tutor Legal</option>
                        <option value="Abuela/o">Abuela/o</option>
                        <option value="Terapeuta">Terapeuta</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Teléfono Directo *</label>
                      <input
                        type="tel"
                        required
                        placeholder="+52 55 1234 5678"
                        value={contact.phone}
                        onChange={(e) => {
                          updateContact(idx, 'phone', e.target.value);
                          if (!contact.whatsapp) {
                            updateContact(idx, 'whatsapp', e.target.value.replace(/\s+/g, ''));
                          }
                        }}
                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-0.5">WhatsApp (con código de país)</label>
                      <input
                        type="text"
                        placeholder="Ej: +525512345678"
                        value={contact.whatsapp}
                        onChange={(e) => updateContact(idx, 'whatsapp', e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Correo (Opcional)</label>
                      <input
                        type="email"
                        placeholder="contacto@ejemplo.com"
                        value={contact.email || ''}
                        onChange={(e) => updateContact(idx, 'email', e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 5: Datos Médicos Críticos (Opcional) */}
          <div className="pt-2 border-t border-slate-100">
            <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <Shield className="w-4 h-4 text-teal-600" />
              5. Datos Médicos Críticos (Opcional)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Grupo Sanguíneo</label>
                <select
                  value={bloodType}
                  onChange={(e) => setBloodType(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-md"
                >
                  <option value="O+">O Positivo (O+)</option>
                  <option value="O-">O Negativo (O-)</option>
                  <option value="A+">A Positivo (A+)</option>
                  <option value="A-">A Negativo (A-)</option>
                  <option value="B+">B Positivo (B+)</option>
                  <option value="B-">B Negativo (B-)</option>
                  <option value="AB+">AB Positivo (AB+)</option>
                  <option value="AB-">AB Negativo (AB-)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Alergias Conocidas</label>
                <input
                  type="text"
                  placeholder="Separadas por comas (ej. Maní, Penicilina)"
                  value={allergiesText}
                  onChange={(e) => setAllergiesText(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Medicamentos Actuales</label>
                <input
                  type="text"
                  placeholder="Ej: Melatonina, Anticonvulsivos"
                  value={medicationsText}
                  onChange={(e) => setMedicationsText(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-md"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Condición Médica Relevante</label>
              <textarea
                rows={2}
                value={medicalAlertNotes}
                onChange={(e) => setMedicalAlertNotes(e.target.value)}
                placeholder="Ej: Tiende a deshidratarse rápidamente. Si convulsiona llamar inmediatamente al 911 y no sujetar la cabeza."
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3 sticky bottom-0 bg-white py-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm transition-colors"
            >
              Guardar Ficha y Actualizar QR
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
