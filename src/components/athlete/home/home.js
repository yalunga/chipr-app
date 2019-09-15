import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import Avatar from 'react-avatar';

import Protected from '../protected';
import UserLayout from '../nav/user-layout';
import WorkoutCard from './workout-card';
import JoinGymForm from '../join-gym-form';

import { getAthleteWorkouts, getGym, setProfilePicture, sendToS3Bucket } from '../../../utils/APIHelper';

const CustomInput = ({ value, onClick }) => (
  <div className="box p-sm mb-0-5" onClick={onClick}>
    <span className="heading p-0 mb-0">{value}</span>
  </div>
);

export default class Home extends Component {
  constructor() {
    super();
    this.state = {
      workouts: [],
      gym: null,
      date: new Date(),
      failedToLoadImage: false,
      loaded: false
    }
    this.hideGymDialog = this.hideGymDialog.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.openGallery = this.openGallery.bind(this);
    this.imageCanvas = null;
  }

  async componentDidMount() {
    try {
      const gymResult = await getGym();
      if (gymResult.data.ok) {
        this.setState({ gym: gymResult.data.gym })
      }
      const result = await getAthleteWorkouts(this.state.date);
      this.setState({
        workouts: result.data.workouts,
        loaded: true
      });
    } catch (error) {
      console.log(error);
    }
  }

  async hideGymDialog(e) {
    try {
      const result = await getAthleteWorkouts(this.state.date);
      const gymResult = await getGym();
      this.setState({ gym: gymResult.data.gym, workouts: result.data.workouts });
    } catch (error) {
      console.log(error);
    }
  }

  async handleSelect(date) {
    try {
      const result = await getAthleteWorkouts(date);
      this.setState({
        workouts: result.data.workouts,
        date
      });
    } catch (error) {
      console.log(error);
    }
  }

  async openGallery() {
    if (window.imagePicker) {
      window.imagePicker.getPictures(async (results) => {
        const fetchResults = await fetch(results[0]);
        const blob = await fetchResults.blob();
        const apiResults = await setProfilePicture();
        const s3URl = apiResults.data.signedUrl;
        const s3Results = await sendToS3Bucket(s3URl, blob);
      }, (error) => {
        console.log(error);
      }, {
        maximumImagesCount: 1
      })
    }
  }

  render() {
    if (!this.state.loaded) return null;
    return (
      <Protected>
        <UserLayout page="athlete">
          {!this.state.gym ? (
            <div>
              <JoinGymForm hideGymDialog={this.hideGymDialog} />
            </div>
          ) : (<div>
            <div className="columns is-mobile is-centered">
              <figure className="image is-96x96 column is-narrow is-paddingless">
                {!this.state.failedToLoadImage ? (
                  <img
                    onClick={this.openGallery}
                    className="is-rounded height-100"
                    src="https://dxpcsvc7gdlhw.cloudfront.net/5d706afe2f95492548ea072b.jpg"
                    onError={() => this.setState({ failedToLoadImage: true })}
                  />
                ) : (
                    <Avatar name="Andy Yalung" />
                  )}
              </figure>
            </div>
            <div className="level is-mobile mb-0-5 mt1">
              <div className="level-left">
                <div className="level-item">
                  <p className="heading is-size-6">{this.state.gym.name}</p>
                </div>
              </div>
              <div className="level-right">
                <div className="level-item">
                  <DatePicker
                    selected={this.state.date}
                    dateFormat="MMMM d, yyyy"
                    withPortal
                    customInput={<CustomInput />}
                    onSelect={this.handleSelect}
                  />
                </div>
              </div>
            </div>
            {this.state.workouts.length === 0 && (
              <span>No workouts scheduled for this day.</span>
            )}
            <div className="columns is-multiline">
              {this.state.workouts.map((workout) => (
                <WorkoutCard workout={workout} key={workout._id} />
              ))}
            </div>
          </div>
            )
          }
        </UserLayout>
      </Protected >
    );
  }
}