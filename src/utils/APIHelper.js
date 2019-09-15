import axios from 'axios';
import qs from 'querystring';
import Cookies from 'js-cookie';
import moment from 'moment';

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

export const registerAthlete = async (name, email, password, gender) => {
  return await axios.post('http://localhost:3030/api/auth/register/athlete', {
    name,
    email,
    password,
    gender
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

export const sendToS3Bucket = async (url, image) => {
  return await axios.put(url, image, {
    headers: {
      'content-type': 'image/jpg'
    }
  })
}

export const setProfilePicture = async () => {
  return await axios('http://localhost:3030/api/athlete/image', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${Cookies.get('token')}`,
    }
  })
  // return await axios.post('http://localhost:3030/api/athlete/image', {
  //   data: { image }
  // }, {
  //   headers: {
  //     authorization: `Bearer ${Cookies.get('token')}`,
  //     "content-type": 'multipart/form-data'
  //   }
  // })
}

export const getWorkouts = async () => {
  return await axios.get('http://localhost:3030/api/gym/getWorkouts', {
    headers: {
      authorization: `Bearer ${Cookies.get('token')}`
    }
  });
}

export const addOrEditWorkout = async (title, scoreType, description, date, id, sets) => {
  return await axios.post('http://localhost:3030/api/gym/addOrEditWorkout', {
    title,
    scoreType,
    description,
    date,
    id,
    sets: scoreType === 3 ? sets : null
  }, {
    headers: {
      authorization: `Bearer ${Cookies.get('token')}`
    }
  });
}

export const deleteWorkout = async (id) => {
  return await axios.post('http://localhost:3030/api/gym/deleteWorkout', {
    id
  }, {
    headers: {
      authorization: `Bearer ${Cookies.get('token')}`
    }
  });
};

export const getAthlete = async () => {
  return await axios.get('http://localhost:3030/api/athlete/', {
    headers: {
      authorization: `Bearer ${Cookies.get('token')}`
    }
  });
}

export const getAthleteWorkouts = async (date) => {
  return await axios.get(`http://localhost:3030/api/athlete/workouts?${qs.stringify({ date: moment(date).startOf('day').toISOString() })}`, {
    headers: {
      authorization: `Bearer ${Cookies.get('token')}`
    }
  });
}

export const getWorkoutById = async (id) => {
  return await axios.get(`http://localhost:3030/api/athlete/workout?${qs.stringify({ id })}`, {
    headers: {
      authorization: `Bearer ${Cookies.get('token')}`
    }
  });
}

export const getGyms = async (input) => {
  return await axios.get(`http://localhost:3030/api/athlete/gyms?${qs.stringify({ input })}`, {
    headers: {
      authorization: `Bearer ${Cookies.get('token')}`
    }
  });
}

export const getGym = async (input) => {
  return await axios.get('http://localhost:3030/api/athlete/gym', {
    headers: {
      authorization: `Bearer ${Cookies.get('token')}`
    }
  });
}

export const setGym = async (gymId) => {
  return await axios.post('http://localhost:3030/api/athlete/gym', {
    gymId
  }, {
    headers: {
      authorization: `Bearer ${Cookies.get('token')}`
    }
  });
}

export const submitScore = async (workout_id, rx_or_scaled, score_type, sets, notes, scores) => {
  if (scores.length === 0) return;
  return await axios.post('http://localhost:3030/api/athlete/score', {
    workout_id,
    rx_or_scaled,
    score_type,
    sets,
    notes,
    scores
  }, {
    headers: {
      authorization: `Bearer ${Cookies.get('token')}`
    }
  });
}

export const getSingleScore = async (id) => {
  return await axios.get(`http://localhost:3030/api/athlete/score?${qs.stringify({ id })}`, {
    headers: {
      authorization: `Bearer ${Cookies.get('token')}`
    }
  });
}

export const getScoresByWorkoutId = async (workout_id, score_type) => {
  return await axios.get(`http://localhost:3030/api/athlete/scores?${qs.stringify({ workout_id, score_type })}`, {
    headers: {
      authorization: `Bearer ${Cookies.get('token')}`
    }
  });
};

export const hasScores = async (workout_ids) => {
  return await axios.get(`http://localhost:3030/api/athlete/hasScores?${qs.stringify({ workout_ids })}`, {
    headers: {
      authorization: `Bearer ${Cookies.get('token')}`
    }
  });
}

export const postComment = async (score_id, comment) => {
  return await axios.post('http://localhost:3030/api/athlete/comment', {
    score_id,
    comment
  }, {
    headers: {
      authorization: `Bearer ${Cookies.get('token')}`
    }
  });
}
