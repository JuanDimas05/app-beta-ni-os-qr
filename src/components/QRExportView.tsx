import React, { useState, useEffect } from 'react';
import { 
  Download, 
  Printer, 
  Copy, 
  Check, 
  ExternalLink, 
  Sparkles, 
  ShieldCheck, 
  Tag, 
  CreditCard, 
  CircleDot
} from 'lucide-react';
import { ChildProfile } from '../types/tea';
import { generateQRDataURL, downloadDataURLAsFile } from '../utils/qrGenerator';

interface QRExportViewProps {
  child: ChildProfile;
  childrenList: ChildProfile[];
  onSelectChild: (c: ChildProfile) => void;
  onOpenPublicScan: (c: ChildProfile) => void;
}

type TagTemplate = 'wristband' | 'pocket_card' | 'clothing_patch';

export const QRExportView: React.FC<QRExportViewProps> = ({
  child,
  childrenList,
  onSelectChild,
  onOpenPublicScan,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [template, setTemplate] = useState<TagTemplate>('wristband');
  const [includeVisiblePhone, setIncludeVisiblePhone] = useState(true);
  const [accentColor, setAccentColor] = useState<'teal' | 'indigo' | 'slate' | 'emerald'>('teal');
  const [customPhrase, setCustomPhrase] = useState('Tengo autismo. Si estoy desorientado o solo, escanea este código para contactar a mi familia.');
  const [copiedLink, setCopiedLink] = useState(false);

  // Construct target scan URL
  const scanUrl = `${window.location.origin}/?view=public_scan&id=${child.qrCodeId}`;

  useEffect(() => {
    let isMounted = true;
    generateQRDataURL(scanUrl, {
      width: 400,
      margin: 1,
      color: {
        dark: accentColor === 'teal' ? '#0f766e' : accentColor === 'indigo' ? '#3730a3' : accentColor === 'emerald' ? '#047857' : '#0f172a',
        light: '#ffffff'
      }
    }).then(url => {
      if (isMounted) setQrDataUrl(url);
    });

    return () => {
      isMounted = false;
    };
  }, [scanUrl, accentColor]);

  const handleDownloadPNG = () => {
    if (!qrDataUrl) return;
    downloadDataURLAsFile(qrDataUrl, `QR_Seguro_${child.nickname}_${child.qrCodeId}.png`);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(scanUrl).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    });
  };

  const primaryContact = child.emergencyContacts.find(c => c.isPrimary) || child.emergencyContacts[0];

  return (
    <div className="space-y-6">
      {/* Selector of Child if multiple */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
            QR
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Generador de Etiquetas & Pulseras de Seguridad
            </h2>
            <p className="text-xs text-slate-500">
              Código QR vinculado a la ficha de auxilio de <strong>{child.nickname}</strong>
            </p>
          </div>
        </div>

        {childrenList.length > 1 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Cambiar perfil:</span>
            <select
              value={child.id}
              onChange={(e) => {
                const found = childrenList.find(c => c.id === e.target.value);
                if (found) onSelectChild(found);
              }}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-800"
            >
              {childrenList.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nickname} ({c.qrCodeId})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Customization Controls (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-5 space-y-5 shadow-xs">
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
              1. Formato de Soporte Físico
            </h3>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setTemplate('wristband')}
                className={`w-full text-left p-3 rounded-xl border transition-colors flex items-center gap-3 ${
                  template === 'wristband'
                    ? 'border-teal-600 bg-teal-50/50 text-teal-950 font-medium'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <CircleDot className="w-4 h-4 text-teal-600 shrink-0" />
                <div>
                  <span className="text-xs block font-bold">Pulsera de Seguridad (Brazalete)</span>
                  <span className="text-[11px] text-slate-500">Diseño alargado para silicona o papel Tyvek</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setTemplate('pocket_card')}
                className={`w-full text-left p-3 rounded-xl border transition-colors flex items-center gap-3 ${
                  template === 'pocket_card'
                    ? 'border-teal-600 bg-teal-50/50 text-teal-950 font-medium'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <CreditCard className="w-4 h-4 text-teal-600 shrink-0" />
                <div>
                  <span className="text-xs block font-bold">Tarjeta de Bolsillo / Credencial</span>
                  <span className="text-[11px] text-slate-500">Formato estándar 85 x 54 mm para cartera o llavero</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setTemplate('clothing_patch')}
                className={`w-full text-left p-3 rounded-xl border transition-colors flex items-center gap-3 ${
                  template === 'clothing_patch'
                    ? 'border-teal-600 bg-teal-50/50 text-teal-950 font-medium'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <Tag className="w-4 h-4 text-teal-600 shrink-0" />
                <div>
                  <span className="text-xs block font-bold">Parche para Ropa o Mochila</span>
                  <span className="text-[11px] text-slate-500">Etiqueta cuadrada termoadhesiva o broche</span>
                </div>
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
              2. Paleta Calmante
            </h3>
            <div className="flex gap-2">
              {[
                { id: 'teal', label: 'Verde Azulado', color: 'bg-teal-700' },
                { id: 'indigo', label: 'Azul Calma', color: 'bg-indigo-800' },
                { id: 'emerald', label: 'Salvia Suave', color: 'bg-emerald-700' },
                { id: 'slate', label: 'Grafito', color: 'bg-slate-800' },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setAccentColor(c.id as any)}
                  className={`w-8 h-8 rounded-full ${c.color} border-2 transition-transform ${
                    accentColor === c.id ? 'border-amber-400 scale-110 shadow-xs' : 'border-transparent'
                  }`}
                  title={c.label}
                />
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              3. Opciones de Privacidad en Impresión
            </h3>
            <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={includeVisiblePhone}
                onChange={(e) => setIncludeVisiblePhone(e.target.checked)}
                className="rounded text-teal-600 focus:ring-teal-500"
              />
              <span>Imprimir teléfono de emergencia visible en el soporte</span>
            </label>
            <p className="text-[11px] text-slate-400 mt-1 pl-5">
              Si se desmarca, el teléfono solo se verá cuando escaneen el QR con un smartphone.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Frase de Asistencia en el Soporte
            </label>
            <textarea
              rows={2}
              value={customPhrase}
              onChange={(e) => setCustomPhrase(e.target.value)}
              className="w-full text-xs p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>

          {/* Quick Action Tools */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <button
              onClick={handlePrint}
              className="w-full py-2.5 px-3 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir Plantilla de Corte</span>
            </button>

            <button
              onClick={handleDownloadPNG}
              className="w-full py-2 px-3 bg-white text-slate-700 border border-slate-300 rounded-lg text-xs font-medium hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4 text-slate-500" />
              <span>Descargar Imagen QR (PNG)</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="w-full py-2 px-3 bg-white text-slate-700 border border-slate-300 rounded-lg text-xs font-medium hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
              <span>{copiedLink ? '¡Enlace copiado!' : 'Copiar URL de Escaneo'}</span>
            </button>

            <button
              onClick={() => onOpenPublicScan(child)}
              className="w-full py-2 px-3 bg-teal-50 text-teal-800 border border-teal-200 rounded-lg text-xs font-semibold hover:bg-teal-100 transition-colors flex items-center justify-center gap-2"
            >
              <ExternalLink className="w-4 h-4 text-teal-700" />
              <span>Ver Ficha Pública como Tercero</span>
            </button>
          </div>
        </div>

        {/* Right Column: Visual Preview of the Chosen Template (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-slate-100/70 p-4 rounded-xl border border-slate-200/80 flex items-center justify-between text-xs text-slate-600">
            <span className="font-semibold text-slate-700">
              Vista previa interactiva del soporte físico para: <span className="text-teal-800">{child.nickname}</span>
            </span>
            <span className="text-slate-400">Escala adaptable para impresión</span>
          </div>

          {/* Printable Container targeted by #printable-export-area */}
          <div 
            id="printable-export-area"
            className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center min-h-[380px]"
          >
            {/* TEMPLATE A: PULSERA DE SEGURIDAD (WRISTBAND) */}
            {template === 'wristband' && (
              <div className="w-full max-w-xl">
                <p className="text-[11px] text-slate-400 text-center mb-3 no-print">
                  Plantilla de pulsera (ancho aprox. 22 cm con solapa de ajuste):
                </p>

                <div className={`w-full rounded-2xl border-2 p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm bg-gradient-to-r from-slate-50 via-white to-slate-50 ${
                  accentColor === 'teal' ? 'border-teal-600' : accentColor === 'indigo' ? 'border-indigo-600' : accentColor === 'emerald' ? 'border-emerald-600' : 'border-slate-800'
                }`}>
                  {/* Left: Child identification tag */}
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-teal-700 text-white flex flex-col items-center justify-center shrink-0">
                      <ShieldCheck className="w-6 h-6" />
                      <span className="text-[9px] font-bold tracking-tight">TEA</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-extrabold text-slate-900 tracking-tight font-display">
                          {child.nickname}
                        </span>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                          {child.age} años
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 max-w-[230px] leading-tight mt-0.5">
                        {customPhrase}
                      </p>
                      {includeVisiblePhone && primaryContact && (
                        <div className="mt-1 text-xs font-bold text-slate-900 font-mono">
                          SOS: {primaryContact.phone} ({primaryContact.relationship})
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Middle / Right: QR code */}
                  <div className="flex flex-col items-center shrink-0 p-2 bg-white rounded-xl border border-slate-200 shadow-2xs">
                    {qrDataUrl ? (
                      <img
                        src={qrDataUrl}
                        alt="Código QR de Seguridad"
                        className="w-24 h-24 object-contain"
                      />
                    ) : (
                      <div className="w-24 h-24 bg-slate-100 animate-pulse rounded" />
                    )}
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                      Escanear aquí
                    </span>
                  </div>
                </div>

                {/* Print cutting guide lines */}
                <div className="mt-3 flex items-center justify-between text-[10px] text-slate-400 border-t border-dashed border-slate-300 pt-2 no-print">
                  <span>✂ Línea de corte superior</span>
                  <span>Ajuste por velcro o broche seguro</span>
                  <span>✂ Línea de corte inferior</span>
                </div>
              </div>
            )}

            {/* TEMPLATE B: TARJETA DE BOLSILLO / CREDENCIAL (85 x 54 mm) */}
            {template === 'pocket_card' && (
              <div className="w-full max-w-md">
                <p className="text-[11px] text-slate-400 text-center mb-3 no-print">
                  Tarjeta de identificación de bolsillo (dimensiones proporcionales a tarjeta de crédito):
                </p>

                <div className="w-full bg-white rounded-2xl border-2 border-slate-800 p-5 shadow-sm space-y-4">
                  {/* Card Header */}
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-teal-700 text-white flex items-center justify-center font-bold text-xs">
                        TEA
                      </div>
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                          Identificación de Asistencia
                        </h4>
                        <span className="text-[10px] text-slate-500">
                          Condición del Espectro Autista
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">
                      {child.qrCodeId}
                    </span>
                  </div>

                  {/* Card Body */}
                  <div className="flex items-start gap-4">
                    <img
                      src={child.photoUrl}
                      alt={child.nickname}
                      className="w-20 h-20 rounded-xl object-cover border border-slate-200 shrink-0"
                    />
                    <div className="flex-1 space-y-1">
                      <div className="text-base font-extrabold text-slate-900">
                        {child.nickname}
                      </div>
                      <div className="text-xs text-slate-600">
                        Edad: <strong>{child.age} años</strong>
                      </div>
                      <div className="text-xs text-slate-600">
                        Comunicación: <strong>{child.communicationType === 'no_verbal' ? 'No verbal' : 'Verbal limitado'}</strong>
                      </div>
                      {child.favoriteComfortItem && (
                        <div className="text-[11px] text-teal-800 font-medium">
                          Confort: {child.favoriteComfortItem}
                        </div>
                      )}
                    </div>

                    <div className="shrink-0 flex flex-col items-center">
                      {qrDataUrl && (
                        <img
                          src={qrDataUrl}
                          alt="QR"
                          className="w-20 h-20 object-contain border border-slate-100 rounded-lg p-1"
                        />
                      )}
                      <span className="text-[9px] font-bold text-slate-700 mt-1">
                        ESCANEAR
                      </span>
                    </div>
                  </div>

                  {/* Card Footer Contacts */}
                  <div className="pt-2 border-t border-slate-100 bg-slate-50 p-2.5 rounded-lg flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">
                        En caso de desorientación llamar a:
                      </span>
                      {primaryContact && (
                        <span className="font-bold text-slate-900">
                          {primaryContact.name} ({primaryContact.relationship}): {primaryContact.phone}
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-right text-slate-500 font-mono">
                      Validez permanente
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TEMPLATE C: PARCHE PARA MOCHILA O ROPA */}
            {template === 'clothing_patch' && (
              <div className="w-full max-w-sm">
                <p className="text-[11px] text-slate-400 text-center mb-3 no-print">
                  Parche termoadhesivo / Etiqueta cuadrada de alta visibilidad (70 x 70 mm):
                </p>

                <div className={`p-6 rounded-3xl border-4 text-center space-y-3 bg-white shadow-sm ${
                  accentColor === 'teal' ? 'border-teal-700' : accentColor === 'indigo' ? 'border-indigo-700' : accentColor === 'emerald' ? 'border-emerald-700' : 'border-slate-900'
                }`}>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-950 rounded-full text-xs font-extrabold uppercase tracking-wide">
                    <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                    <span>Apoyo Sensorial TEA</span>
                  </div>

                  <div className="text-xl font-black text-slate-900 tracking-tight font-display">
                    {child.nickname}
                  </div>

                  <div className="flex justify-center my-2">
                    {qrDataUrl && (
                      <div className="p-2.5 bg-white border-2 border-slate-900 rounded-2xl shadow-xs">
                        <img
                          src={qrDataUrl}
                          alt="QR Parche"
                          className="w-36 h-36 object-contain"
                        />
                      </div>
                    )}
                  </div>

                  <p className="text-xs font-semibold text-slate-700 leading-tight">
                    Si me ves solo o en crisis, por favor escanea este código para llamar a mi familia.
                  </p>

                  {includeVisiblePhone && primaryContact && (
                    <div className="pt-2 border-t border-slate-200 text-xs font-bold text-slate-900 font-mono">
                      📞 {primaryContact.phone}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Technical Implementation details banner */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
            <span className="font-semibold text-slate-800 block">
              Características del Código QR Generado:
            </span>
            <ul className="list-disc list-inside space-y-0.5 text-slate-600">
              <li>Nivel de corrección de errores <strong>Nivel M/H</strong> (legible incluso con rayaduras o desgaste físico de hasta 25%).</li>
              <li>URL dinámica redirigible: Permite a los padres actualizar medicamentos o teléfonos sin reimprimir la pulsera.</li>
              <li>Sin descarga requerida: Abre directamente en el navegador nativo de cualquier teléfono iOS o Android.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
