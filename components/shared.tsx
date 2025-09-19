import React from "react";

// Reusable InputField component
interface InputFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}) => (
  <div>
    <label
      htmlFor={name}
      className="block mb-2 font-semibold text-gray-700 text-sm"
    >
      {label}
    </label>
    <input
      type={type}
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="w-full px-3 py-3 border border-gray-300 rounded-lg text-base text-gray-900 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
    />
  </div>
);

// Reusable LoadingButton component
interface LoadingButtonProps {
  isLoading: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const LoadingButton: React.FC<LoadingButtonProps> = ({
  isLoading,
  children,
  onClick,
  type = "button",
  disabled = false,
  className,
  style,
}) => (
  <button
    type={type}
    onClick={onClick}
    disabled={isLoading || disabled}
    className={`${className || ""} ${isLoading || disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
    style={style}
  >
    {isLoading ? (
      <span className="flex items-center gap-2">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
        <span>Loading...</span>
      </span>
    ) : (
      children
    )}
  </button>
);

// Reusable DeleteButton component
interface DeleteButtonProps {
  onClick: () => void;
  disabled?: boolean;
  isDeleting?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const DeleteButton: React.FC<DeleteButtonProps> = ({
  onClick,
  disabled = false,
  isDeleting = false,
  className,
  style,
}) => (
  <button
    onClick={onClick}
    disabled={disabled || isDeleting}
    className={`${className || ""} ${disabled || isDeleting ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
    style={style}
  >
    {isDeleting ? "Deleting..." : "Delete"}
  </button>
);

// Reusable DeleteModal component
interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  customerName: string;
  isDeleting?: boolean;
}

export const DeleteModal: React.FC<DeleteModalProps> = ({
  isOpen,
  onClose,
  onDelete,
  customerName,
  isDeleting = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Delete Customer
        </h3>
        <p className="text-gray-600 mb-6 leading-relaxed">
          Are you sure you want to delete <strong>{customerName}</strong>? This
          action cannot be undone.
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 bg-transparent text-gray-600 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
          <LoadingButton
            isLoading={isDeleting}
            onClick={onDelete}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white border-none rounded-md text-sm font-medium"
          >
            Delete
          </LoadingButton>
        </div>
      </div>
    </div>
  );
};

// Reusable LoadingState component
interface LoadingStateProps {
  message?: string;
  isMobile?: boolean;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = "Loading...",
  isMobile = false,
}) => (
  <div className={`${isMobile ? "p-4" : "p-6"} bg-gray-50 min-h-screen`}>
    <div className="max-w-4xl mx-auto">
      <div className={`text-center ${isMobile ? "py-10" : "py-16"}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <div
          className={`${isMobile ? "text-base" : "text-lg"} text-gray-600 font-medium`}
        >
          {message}
        </div>
      </div>
    </div>
  </div>
);

// Reusable ErrorState component
interface ErrorStateProps {
  message: string;
  isMobile?: boolean;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  message,
  isMobile = false,
  onRetry,
}) => (
  <div className={`${isMobile ? "p-4" : "p-6"} bg-gray-50 min-h-screen`}>
    <div className="max-w-4xl mx-auto">
      <div className={`text-center ${isMobile ? "py-10" : "py-16"}`}>
        <div
          className={`${isMobile ? "text-base" : "text-lg"} text-red-600 mb-4 font-medium`}
        >
          {message}
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white border-none rounded-lg text-base font-semibold cursor-pointer transition-colors"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  </div>
);
