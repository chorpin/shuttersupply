import React, { useState } from 'react';

const GetCompanyInfo = () => {
  const [companyInfo, setCompanyInfo] = useState(null);

  const handleGetCompanyInfo = async () => {
    try {
      const response = await fetch('/getCompanyInfo');
      const data = await response.json();
      setCompanyInfo(data);
    } catch (error) {
      console.error('Error fetching company info:', error);
    }
  };

  return (
    <div>
      <button onClick={handleGetCompanyInfo}>Get Company Info</button>
      {companyInfo && (
        <div>
          <h3>Company Information:</h3>
          <pre>{JSON.stringify(companyInfo, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default GetCompanyInfo;
