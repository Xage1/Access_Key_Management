import Admin from '../model/Admin'; // Adjust the path as necessary

async function getNextAdminCode() {
  const lastAdmin = await Admin.findOne().sort('-adminCode').exec();
  let nextCode = '';

  if (lastAdmin && lastAdmin.adminCode) {
    const numericPart = parseInt(lastAdmin.adminCode.replace(/ADM-/i, ''), 10);
    
    // Check if the current numeric part is less than or equal to 5
    if (numericPart <= 5) {
      nextCode = `ADM-${String(numericPart + 1).padStart(3, '0')}`;
    } else {
      // If the numeric part exceeds 5, set nextCode to the maximum allowed code
      nextCode = 'ADM-006';
    }
  } else {
    nextCode = 'ADM-000';
  }

  return nextCode;
}

export { getNextAdminCode };