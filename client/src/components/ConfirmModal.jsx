import React from 'react';
import ReactDOM from 'react-dom';

const ConfirmModal = ({ open, title, message, onConfirm, onCancel, confirmText = 'Confirm', cancelText = 'Cancel' }) => {
  if (!open) return null;
  const isLogout = confirmText.toLowerCase() === 'logout';
  return ReactDOM.createPortal(
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.4)' }}>
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center animate-fade-in-up">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <p className="mb-6 text-gray-700">{message}</p>
        <div className="flex justify-center gap-4">
          <button
            className={
              isLogout
                ? "px-6 py-2 rounded-full bg-red-600 text-white font-semibold shadow hover:bg-red-700 transition-all"
                : "px-6 py-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold shadow hover:from-blue-600 hover:to-blue-800 transition-all"
            }
            onClick={onConfirm}
          >
            {confirmText}
          </button>
          <button
            className="px-6 py-2 rounded-full bg-gray-200 text-gray-700 font-semibold shadow hover:bg-gray-300 transition-all"
            onClick={onCancel}
          >
            {cancelText}
          </button>
        </div>
      </div>
      <style>{`
        .animate-fade-in-up {
          animation: fade-in-up-modal 0.3s cubic-bezier(.4,0,.2,1) both;
        }
        @keyframes fade-in-up-modal {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>,
    document.body
  );
};

export default ConfirmModal; 