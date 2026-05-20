const calculateAge = (dob, asOfDate = new Date()) => {
  if (!dob) return "";

  const birthDate = new Date(dob);
  const refDate = new Date(asOfDate);

  let age = refDate.getFullYear() - birthDate.getFullYear();

  const monthDiff = refDate.getMonth() - birthDate.getMonth();
  const dayDiff = refDate.getDate() - birthDate.getDate();

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }

  return age;
};

export {calculateAge}