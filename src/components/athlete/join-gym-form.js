import React, { Component } from 'react';
import AsyncSelect from 'react-select/async';
import { getGyms, setGym } from '../../utils/APIHelper';

export default class JoinGymForm extends Component {
  constructor() {
    super();
    this.state = {
      selectedGym: null
    };
    this.handleAsync = this.handleAsync.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
  }

  async handleAsync(input) {
    try {
      const result = await getGyms(input);
      if (result.data.ok) {
        return result.data.gyms;
      }
    } catch (error) {
      console.log(error)
    }
  }

  handleChange(e) {
    this.setState({ selectedGym: e });
  }

  async handleSave() {
    const result = await setGym(this.state.selectedGym.value);
    if (result.data.ok) {
      this.props.hideGymDialog();
    }
  }

  render() {
    return (
      <div className="box">
        <p className="subtitle">Join a gym</p>
        <AsyncSelect
          cacheOptions
          loadOptions={this.handleAsync}
          placeholder="Please start typing..."
          onChange={this.handleChange}
        />
        <button
          className="button is-primary mt1"
          onClick={this.handleSave}
          disabled={this.state.selectedGym === null}
        >
          Join
        </button>
      </div>
    )
  }
}