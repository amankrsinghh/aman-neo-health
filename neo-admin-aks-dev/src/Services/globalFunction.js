// src/Service/globalFunction.js

/**
 * Calculate age from date of birth
 * @param {string | Date} dob
 * @returns {number}
 */
export const calculateAge = (dob) => {
  if (!dob) return "-";

  const birthDate = new Date(dob);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
};

/**
 * Format date & time (dd-mm-yyyy hh:mm AM/PM)
 * @param {string | Date} date
 * @returns {string}
 */
export const formatDateTime = (date) => {
  if (!date) return "-";

  const d = new Date(date);

  return d.toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};
export const statusClass = (s) => {
    const map = {
      approved: "approved-active",
      rejected: "reject",
      block: "reject",
      verify: "approved-visited",
    };

    return map[s] || "approved-pending";
  };
