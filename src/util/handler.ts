import React from "react";
export const preventDefault = (e: React.FormEvent) => {
  e.preventDefault();
};
export const stopPropagation = (e: React.FormEvent) => {
  e.stopPropagation();
};
