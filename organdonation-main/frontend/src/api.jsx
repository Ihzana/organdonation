import axios from "axios";
const API_URL = "http://127.0.1.1:5000";

//login
export const logindonor = async(email,password) =>{
    try{
        const response = axios.post(`${API_URL}/logindonor`,{email,password});
        return response;
    }catch(error){
        console.error("Login Error:", error.response?.data?.message || error.message);
        throw error.response?.data || { message: "Something went wrong" };
    }
}
export const loginhospital = async(email,password) =>{
    try{
        const response = axios.post(`${API_URL}/loginhospital`,{email,password});
        return response;
    }catch(error){
        console.error("Login Error:", error.response?.data?.message || error.message);
        throw error.response?.data || { message: "Something went wrong" };
    }
}
export const loginrecip = async(email,password) =>{
    try{
        const response = axios.post(`${API_URL}/loginrecip`,{email,password});
        return response;
    }catch(error){
        console.error("Login Error:", error.response?.data?.message || error.message);
        throw error.response?.data || { message: "Something went wrong" };
    }
}
///signup
export const signupdonor = async (email, password,name) => {
    try {
      const response = await axios.post(`${API_URL}/signupdonor`, { 
        email, 
        password,
        name
      });
      
      return response.data; 
    } catch (error) {
      console.error("Signup Error:", error.response?.data || error.message);
      throw error;
    }
  };


export const signuphosp = async (email, password,name) => {
    try {
      const response = await axios.post(`${API_URL}/signuphosp`, { 
        email, 
        password ,
        name
      });
      
      return response.data; 
    } catch (error) {
      console.error("Signup Error:", error.response?.data || error.message);
      throw error;
    }
  };

export const signuprecp = async (email, password,name) => {
    try {
      const response = await axios.post(`${API_URL}/signuprecp`, { 
        email, 
        password,
        name
      });
      
      return response.data; 
    } catch (error) {
      console.error("Signup Error:", error.response?.data || error.message);
      throw error;
    }
  };


//insert donor........................................

export const insertdonor = async (donor_name, organ,hospital,status) => {
  try {
    const response = await axios.post(`${API_URL}/insertdonor`, { 
      donor_name, organ,hospital,status
    });
    
    return response; 
  } catch (error) {
    console.error("insertion:", error.response?.data || error.message);
    throw error;
  }
};
//getting my donation....................................


export const getMyDonation = async (username) => {
  try {
    const response = await axios.get(`${API_URL}/getmydonation`,{
      params: { username },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching donations:", error);
    return [];
  }
};


export const getDonationavailable = async () => {
  try {
    const response = await axios.get(`${API_URL}/getalldonationnotreserved`);
    return response.data;
  } catch (error) {
    console.error("Error fetching donations:", error);
    return [];
  }
};


//deleting donation.............................

export const deletedonation = async (id) => {
  try {
    const response = await axios.post(`${API_URL}/deletedonation`, { 
      id
    });
    
    return response; 
  } catch (error) {
    console.error("deletion:", error.response?.data || error.message);
    throw error;
  }
};


export const insertrecp = async (donor_id,name ,hospital) => {
  try {
    const response = await axios.post(`${API_URL}/insertrecipient`, { 
      donor_id,name ,hospital
    });
    
    return response; 
  } catch (error) {
    console.error("insertion:", error.response?.data || error.message);
    throw error;
  }
};



export const getrecipientlist = async (username) => {
  try {
    const response = await axios.get(`${API_URL}/getallrecipient`,{params: { username }});
    return response.data;
  } catch (error) {
    console.error("Error fetching donations:", error);
    return [];
  }
};

export const deleterecp = async (donor_id,id) => {
  try {
    const response = await axios.post(`${API_URL}/deleterecipient`, { 
      donor_id,id
    });
    
    return response; 
  } catch (error) {
    console.error("deletion:", error.response?.data || error.message);
    throw error;
  }
};



//hospital........................................


export const fetchRecipients = async (hospitalname) => {
  try {
    const response = await axios.get(`${API_URL}/getrecipient`, { params: { hospitalname } });
    console.log(response.data)
    return response.data; // ✅ Only return the data
  } catch (err) {
    console.error("Fetching Error:", err.response?.data || err.message); // ✅ Use `err`
    throw err;
  }
};

///admin................
export const getrecipientlistadmin = async () => {
  try {
    const response = await axios.get(`${API_URL}/getallrecipientadmin`);
    return response.data;
  } catch (error) {
    console.error("Error fetching donations:", error);
    return [];
  }
};

export const getdonationadmin = async () => {
  try {
    const response = await axios.get(`${API_URL}/getalldonationadmin`);
    return response.data;
  } catch (error) {
    console.error("Error fetching donations:", error);
    return [];
  }
};

export const gethospitaladmin = async () => {
  try {
    const response = await axios.get(`${API_URL}/getallhospitals`);
    return response.data;
  } catch (error) {
    console.error("Error fetching donations:", error);
    return [];
  }
};

export default{logindonor,loginhospital,loginrecip,signupdonor,signuphosp,signuprecp,insertdonor,getMyDonation,deletedonation,getDonationavailable,insertrecp,getrecipientlist,deleterecp,fetchRecipients,getrecipientlistadmin,getdonationadmin,gethospitaladmin};