import React from 'react';

/**
 * Official two-tone Python logo. Matches the lucide icon API closely enough to
 * drop in next to them (`className` for sizing via Tailwind h-/w- utilities).
 */
const PythonLogo: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 256 255"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="xMinYMin meet"
    aria-hidden="true"
  >
    <defs>
      <linearGradient x1="12.959%" y1="12.039%" x2="79.639%" y2="78.201%" id="python-logo-blue">
        <stop stopColor="#387EB8" offset="0%" />
        <stop stopColor="#366994" offset="100%" />
      </linearGradient>
      <linearGradient x1="19.128%" y1="20.579%" x2="90.742%" y2="88.429%" id="python-logo-yellow">
        <stop stopColor="#FFE052" offset="0%" />
        <stop stopColor="#FFC331" offset="100%" />
      </linearGradient>
    </defs>
    <path
      fill="url(#python-logo-blue)"
      d="M126.916.072c-64.832 0-60.784 28.115-60.784 28.115l.072 29.128h61.868v8.745H41.631S.145 61.355.145 126.77c0 65.417 36.21 63.097 36.21 63.097h21.61v-30.356s-1.165-36.21 35.632-36.21h61.362s34.475.557 34.475-33.319V33.97S224.892.072 126.916.072zM92.802 19.66a11.12 11.12 0 0 1 11.13 11.13 11.12 11.12 0 0 1-11.13 11.13 11.12 11.12 0 0 1-11.13-11.13 11.12 11.12 0 0 1 11.13-11.13z"
    />
    <path
      fill="url(#python-logo-yellow)"
      d="M128.757 254.126c64.832 0 60.784-28.115 60.784-28.115l-.072-29.128h-61.868v-8.745h86.441s41.486 4.705 41.486-60.711c0-65.416-36.21-63.096-36.21-63.096h-21.61v30.355s1.165 36.21-35.632 36.21h-61.362s-34.475-.557-34.475 33.32v56.013s-5.235 33.897 92.518 33.897zm34.114-19.586a11.12 11.12 0 0 1-11.13-11.13 11.12 11.12 0 0 1 11.13-11.131 11.12 11.12 0 0 1 11.13 11.13 11.12 11.12 0 0 1-11.13 11.13z"
    />
  </svg>
);

export default PythonLogo;
