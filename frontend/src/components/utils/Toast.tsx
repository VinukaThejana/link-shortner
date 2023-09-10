"use client";
import { Toaster } from 'react-hot-toast';

export const Toast = () => {
  return (
    <Toaster
      toastOptions={{
        style: {
          color: "black",
          padding: "16px",
          background: "#E9E7E7",
          border: "1px #CBD5E1 solid"
        }
      }}
    />
  );
};
