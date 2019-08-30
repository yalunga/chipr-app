import axios from 'axios';

export const login = async (email, password, admin) => {
  if (admin) {
    return await axios.post('http://localhost:3030/api/auth/login/gym', {
      email,
      password,
      admin
    });
  }
  return await axios.post('http://localhost:3030/api/auth/login/athlete', {
    email,
    password
  });
};

export const registerAthlete = async (name, email, password) => {
  return await axios.post('http://localhost:3030/api/auth/register/athlete', {
    name,
    email,
    password
  })
};

export const registerGym = async (name, gymName, email, password) => {
  return await axios.post('http://localhost:3030/api/auth/register/gym', {
    name,
    gymName,
    email,
    password
  })
};

export const getWorkouts = async () => {
  return await axios.get('http://localhost:3030/api/coach/getWorkouts', {
    headers: {
      authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
}

export const addOrEditWorkout = async (title, scoreType, description, date, id) => {
  return await axios.post('http://localhost:3030/api/coach/addOrEditWorkout', {
    title,
    scoreType,
    description,
    date,
    id
  }, {
      headers: {
        authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
}

export const deleteWorkout = async (id) => {
  return await axios.post('http://localhost:3030/api/coach/deleteWorkout', {
    id
  }, {
      headers: {
        authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
};