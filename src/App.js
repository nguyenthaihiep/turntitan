import React, { Component } from 'react';
import logo from './titannail.jpg';
import './assets/bootstrap/bootstrap.min.css';
import './assets/scss/app.scss';
import { connect } from 'react-redux';
import WithErrorHandler from './hoc/WithErrorHandler';
import axios from './axios';
import Aux from './hoc/Auxx';
import FormLogin from './components/Layout/FormLogin';
import WorkList from './components/Layout/WorkList';
import AddTurn from './components/Layout/AddTurn';
import FormDelete from './components/Layout/FormDelete';
import ChangePassword from './components/Layout/ChangePassword';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      workList: [],
      showWorkList: false,
      formEmployee: {
        name: '',
        password: ''
      },
      employees: [],
      fetchDate: null,
      showLogin: false,
      memberDeleteId: null,
      searchDate: null,
      memberAddTurnId: null,
      employee: null
    }
    this.setup();
  }

  workList(employee) {
    this.setState({employee: employee});
    window.$('#workList').modal('show')
  }
  addTurn(employee) {
    //this.setState({memberAddTurnId: id});
    this.setState({employee: employee});
    window.$('#addTurn').modal('show')
  }
  showLogin() {
    window.$('#formLogin').modal('show')
  }
  logout() {
    this.props.setToken(null, null);
  }
  showModelDelete(id) {
    this.setState({memberDeleteId: id});
    window.$('#formDelete').modal('show');
  }
  showChangePassword() {
    window.$('#changePassword').modal('show')
  }

  deleteMember() {
    axios.delete(`/employees/${this.state.fetchDate}/${this.state.memberDeleteId}.json?auth=` + this.props.token)
    .then(response => {
      if(response !== undefined) {
        window.$('#formDelete').modal('hide');
        const updateEmployees = [
          ...this.state.employees
        ];
        const newEmployees = updateEmployees.filter(item => item.id !== this.state.memberDeleteId)
        this.setState({employees: newEmployees});
      }
    })
    .catch(error => {
      console.log(error);
    })
  }

  inputChangeHandler = (event, form, name) => {
    const updateForm = {
      ...this.state[form]
    };
    const value = event.target.value;

    updateForm[name] = value;
    this.setState({[form]:updateForm});
  }

  employeeLogin() {
    if(this.state.formEmployee.name) {
      const employee = {
        name: this.state.formEmployee.name,
        password: this.state.formEmployee.password,
        total_turn: 0,
        total: 0,
        start_time: '',
        status: 1,
        login_time: currentTime(),
        working: 0,
        work_list: []
      }
      axios.post(`/employees/${this.state.fetchDate}.json?auth=` + this.props.token, employee)
      .then(response => {
        if(response !== undefined) {
          const updateEmployees = [
            ...this.state.employees
          ]
          updateEmployees.push(employee);
          this.setState({employees: updateEmployees})
        }
      })
      .catch(error => {
        
      });
    }
  }

  setup() {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');
    this.props.setToken(token, email);
    const d = new Date();
    let fetchDate = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
    if(token) {
      axios.get(`/employees/${fetchDate}.json`)
        .then(res => {
          const fetchEmployees = [];
          for(let key in res.data){
            const workList = [];
            for(let k in res.data[key].work_list) {
              workList.push({
                ...res.data[key].work_list[k],
                id: k
              })
            }
            res.data[key].work_list = workList;
            fetchEmployees.push({
              ...res.data[key],
              id: key
            });
          }
          this.setState({employees: fetchEmployees, fetchDate: fetchDate});
        })
        .catch(error => {
          //this.setState({loading: false});
        });
    }
  }

  updateWorkList = (turn) => {
    let updateEmployees = [
      ...this.state.employees
    ]
    const employee = {};
    updateEmployees.map(item => {
      if(item.id === this.state.employee.id) {
        //employee = item;
        item.work_list.push(turn);
      }
    })
    //employee.work_list.push(turn);
    this.setState({employees: updateEmployees});
  }

  serchDate() {
    const d = this.state.searchDate;
    if(!d) {
      return;
    }
    const fetchDate = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
    axios.get(`/employees/${fetchDate}.json`)
      .then(res => {
        const fetchEmployees = [];
        for(let key in res.data){
          fetchEmployees.push({
            ...res.data[key],
            id: key
          });
        }
        this.setState({employees: fetchEmployees});
      })
      .catch(error => {
        //this.setState({loading: false});
      });
  }

  handleDateChange = (d) => {
    this.setState({searchDate: d})
  }

  render() {
    return (
      <Aux>
        <header>
          <div className="logo">
            <img alt="" src={logo} />
          </div>
          <div className="site"><h1>Demoturn’s Turn Management</h1></div>
          <div className="login">
            {
              !this.props.token &&
              <div onClick={() => this.showLogin()}>login</div>
            }
            {
              this.props.token &&
              <Aux>
                <div onClick={() => this.showChangePassword()}>Change password</div>
                <div onClick={() => this.logout()}>logout</div>
              </Aux>
            }
          </div>
        </header>
        <section className="form mb-4">
          <div className="row">
            <div className="col-sm-4 mb-4">
              <div className="row">
                <div className="col-sm-3">
                  <label>Employee Name</label>
                </div>
                <div className="col-sm-9">
                  <input className="form-control" type="text" value={this.state.formEmployee.name} onChange={(event) => this.inputChangeHandler(event, 'formEmployee', 'name')} />
                </div>
              </div>
            </div>

            <div className="col-sm-4">
              <div className="row">
                <div className="col-sm-3">
                  <label>Password</label>
                </div>
                <div className="col-sm-9">
                  <input className="form-control" type="password" value={this.state.formEmployee.password} onChange={(event) => this.inputChangeHandler(event, 'formEmployee', 'password')} />
                </div>
              </div>
            </div>

            <div className="col-sm-4">
              <button className="btn btn-primary" onClick={() => this.employeeLogin()}>Login</button>
            </div>

            <div className="col-sm-4">
              <div className="row">
                <div className="col-sm-3">
                </div>
                <div className="col-sm-4">
                  <DatePicker
                    className="form-control"
                    selected={this.state.searchDate}
                    onChange={(date) => this.handleDateChange(date)}
                    dateFormat="yyyy-MM-dd"
                  />
                </div>
                <button className="btn btn-primary" onClick={() => this.serchDate()}>Search</button>
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" id="security" /> <label className="form-check-label" htmlFor="security">Security Check</label>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="table-data">
          <table className="table table-striped table-borderless">
            <thead>
              <tr>
                <th>No</th>
                <th>Employee</th>
                <th>Total turn</th>
                <th>Total</th>
                <th>Start time</th>
                <th>Status</th>
                <th>Login time</th>
                <th>Turn list</th>
                <th>Add turn</th>
                <th>Working</th>
                <th>Action</th>
                <th>View password</th>
              </tr>
            </thead>
            <tbody>
              {
                this.state.employees.length > 0 &&

                this.state.employees.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.name}</td>
                    <td>0.0</td>
                    <td>0.0</td>
                    <td>{item.start_time === '' ? 'No working' : item.start_time}</td>
                    <td>Active</td>
                    <td>{item.login_time}</td>
                    <td><button className="btn btn-primary" onClick={() => this.workList(item)}>View turn</button></td>
                    <td><button className="btn btn-primary" onClick={() => this.addTurn(item)}>Add turn</button></td>
                    <td>Free</td>
                    <td><button className="btn btn-danger" onClick={() => this.showModelDelete(item.id)}>Delete</button></td>
                    <td>View password</td>
                  </tr>
                ))
              }
              {
                this.state.employees.length === 0 &&

                <tr>
                  <td colSpan="12" align="center">No Data</td>
                </tr>
              }
            </tbody>
          </table>
        </section>
        <WorkList 
          employee={this.state.employee}
        />
        <AddTurn 
          fetchDate={this.state.fetchDate} 
          employee={this.state.employee}
          currentTime={currentTime()}
          updateWorkList={() => this.updateWorkList()}
        />
        <FormLogin />
        <FormDelete
          deleted={() => this.deleteMember()}
        />
        <ChangePassword />
      </Aux>
    )
  }
}

const currentTime = () => {
  const d = new Date();
  let hour = d.getHours();
  if(hour < 10) {
    hour = '0' + hour;
  }
  let minute = d.getMinutes();
  if(minute < 10) {
    minute = '0' + minute;
  }
  let second = d.getSeconds();
  if(second < 10) {
    second = '0' + second;
  }

  return hour + ':' + minute + ':' + second;
}

const mapStateToProps = state => {
  return {
    token: state.session.token
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setToken: (token, email) => dispatch({type: 'SET_TOKEN', token: token, email: email})
  }
}

/*const SelectDate = () => {
  const [startDate, setStartDate] = useState(new Date());
  return (
    <DatePicker selected={startDate} onChange={date => setStartDate(date)} />
  );
};*/

export default connect(mapStateToProps, mapDispatchToProps)(WithErrorHandler(App, axios));
