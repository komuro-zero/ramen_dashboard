"use client";
export function LoadingModal({
  message: message,
  color: color,
}: {
  message?: string | undefined;
  color?: string | undefined;
}) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
        <div
          className={`w-12 h-12 border-t-4 border-${
            color ? color : "blue"
          }-600 border-solid rounded-full animate-spin`}
        ></div>
        <p className="mt-4 text-lg font-semibold text-gray-700">
          {message ? message : "Loading results..."}
        </p>
      </div>
    </div>
  );
}
