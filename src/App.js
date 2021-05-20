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
import FormAskedPassword from './components/Layout/FormAskedPassword';
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
      employee: null,
    }
    this.setup();
  }
  componentDidMount() {
    const unquie = new Date().getTime();
    const toast = document.createElement("div");
    const toastContent = document.createElement("div");
    toastContent.id = unquie;
    toastContent.className = "toast";
    const toastBody = document.createElement("div");
    toastBody.className = "toast-body";
    toastBody.innerText = "Hello, world! This is a toast message.";
    toast.appendChild(toastContent);
    toastContent.appendChild(toastBody);
    document.body.appendChild(toast);
    window.$('#'+unquie).toast('show');
    window.$('#'+unquie).on('hidden.bs.toast', function () {
      window.$('#'+unquie).parent().remove();
    })
  }  
  workList(index) {
    this.props.setMemberAddTurnId(index);
    window.$('#workList').modal('show')
  }
  addTurn(index) {
    this.props.setMemberAddTurnId(index);
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
  showModelAskedPassword(id, action) {
    this.props.setMemberAction(id, action);
    window.$('#formAskedPassword').modal('show');
  }
  showChangePassword() {
    window.$('#changePassword').modal('show')
  }

  deleteMember(index) {
    const memberDeleteId = this.props.employees[index].id;
    axios.delete(`/employees/${this.props.fetchDate}/${memberDeleteId}.json?auth=` + this.props.token)
    .then(response => {
      if(response !== undefined) {
        const updateEmployees = [
          ...this.props.employees
        ];
        updateEmployees.splice(index,1);
        this.props.updateEmployees(updateEmployees);
      }
    })
    .catch(error => {
      console.log(error);
    })
  }
  changeWorking(index) {
    const employee = this.props.employees[index];
    if(employee.working === 0) {
      employee.working = 1;
      employee.start_time = currentTime();
    } else {
      employee.working = 0;
      employee.start_time = '';
    }

    this.updateEmployees(employee, index);
  }

  changeStatus(index) {
    const employee = this.props.employees[index];
    if(employee.status === 1) {
      employee.status = 0;
    } else {
      employee.status = 1;
    }

    this.updateEmployees(employee, index);
  }

  updateEmployees(employee, index) {
    axios.put(`/employees/${this.props.fetchDate}/${employee.id}.json?auth=` + this.props.token, employee)
    .then(response => {
      if(response !== undefined) {
        let updateEmployees = [
          ...this.props.employees,
        ];
        updateEmployees[index] = employee;
        updateEmployees = this.BubbleSort(updateEmployees);
        this.props.updateEmployees(updateEmployees);
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
      axios.post(`/employees/${this.props.fetchDate}.json?auth=` + this.props.token, employee)
      .then(response => {
        if(response !== undefined) {
          let updateEmployees = [
            ...this.props.employees
          ]
          updateEmployees.unshift(employee);
          //this.setState({employees: updateEmployees})
          updateEmployees = this.BubbleSort(updateEmployees);
          this.props.updateEmployees(updateEmployees);
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
          let fetchEmployees = [];
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
          fetchEmployees = this.BubbleSort(fetchEmployees);
          //this.setState({employees: fetchEmployees, fetchDate: fetchDate});
          this.props.setup(fetchEmployees, fetchDate);
        })
        .catch(error => {
          //this.setState({loading: false});
        });
    }
  }

  BubbleSort(employees) {
    let updateEmployees = [];
    const tmpFreeWorker = [];
    const tmpBusyWorker = [];
    const tmpInActiveWorker = [];
    for(let i = 0; i < employees.length; i++) {
      if(employees[i].status === 1 && employees[i].working === 0) {
        tmpFreeWorker.push(employees[i]);
      } else if(employees[i].status === 1 && employees[i].working === 1) {
        tmpBusyWorker.push(employees[i]);
      } else {
        tmpInActiveWorker.push(employees[i]);
      }
    }
    let step_turn = 1;
    for(let j = 0; j < tmpFreeWorker.length - 1; j++) {
      for(let i = j + 1; i < tmpFreeWorker.length; i++) {
        if (tmpFreeWorker[j].total_turn - step_turn < tmpFreeWorker[i].total_turn) {
          if (this.isBefore(tmpFreeWorker[j].login_time, tmpFreeWorker[i].login_time)) {
            this.swapArrayElements(tmpFreeWorker, i - 1, j);
          }
        }
      }
    }
    updateEmployees = updateEmployees.concat(tmpFreeWorker);
    for(let i = 0; i < tmpBusyWorker.length - 1; i++) {
      for(let j = i + 1; j < tmpBusyWorker.length; j++) {
        if (tmpBusyWorker[i].total > tmpBusyWorker[j].total) {
          this.swapArrayElements(tmpBusyWorker, i, j);
        } else if (tmpBusyWorker[i].total === tmpBusyWorker[j].total) {
          if (!this.isBefore(tmpBusyWorker[i].login_time, tmpBusyWorker[j].login_time)) {
            this.swapArrayElements(tmpBusyWorker, i, j);
          }
        }
      }
    }
    updateEmployees = updateEmployees.concat(tmpBusyWorker);

    for(let i = 0; i < tmpInActiveWorker.length - 1; i++) {
      for(let j = 0; j < tmpInActiveWorker.length; j++) {
        if (!this.isBefore(tmpInActiveWorker[i].login_time, tmpInActiveWorker[j].login_time)) {
          this.swapArrayElements(tmpInActiveWorker, i, j);
        }
      }
    }
    //console.log(1111);
    updateEmployees = updateEmployees.concat(tmpInActiveWorker);
    //console.log(updateEmployees);
    return updateEmployees;
  }

  isBefore(timeA, timeB) {
    if(timeA < timeB) {
      return true;
    }
    return false;
  }
  swapArrayElements(arr, indexA, indexB) {
    const temp = arr[indexA];
    arr[indexA] = arr[indexB];
    arr[indexB] = temp;
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
              (!this.props.token || this.props.token === 'null') &&
              <div onClick={() => this.showLogin()}>login</div>
            }
            {
              this.props.token && this.props.token !== 'null' &&
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
                this.props.employees.length > 0 &&

                this.props.employees.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.name}</td>
                    <td>{item.total_turn}</td>
                    <td>{item.total}</td>
                    <td>{item.start_time === '' ? 'No working' : item.start_time}</td>
                    <td>
                      {
                        item.status === 1 &&
                        <button className="btn btn-primary" onClick={() => this.showModelAskedPassword(index, 'status')}>Active</button>
                      }
                      {
                        item.status === 0 &&
                        <button className="btn btn-primary" onClick={() => this.showModelAskedPassword(index, 'status')}>Inactive</button>
                      }
                    </td>
                    <td>{item.login_time}</td>
                    <td><button className="btn btn-primary" onClick={() => this.workList(index)}>View turn</button></td>
                    <td><button className="btn btn-primary" onClick={() => this.addTurn(index)}>Add turn</button></td>
                    <td>
                      {
                        item.working === 0 &&
                        <button className="btn btn-primary" onClick={() => this.showModelAskedPassword(index, 'working')}>Free</button>
                      }
                      {
                        item.working === 1 &&
                        <button className="btn btn-warning" onClick={() => this.showModelAskedPassword(index, 'working')}>Working</button>
                      }
                    </td>
                    <td><button className="btn btn-danger" onClick={() => this.showModelAskedPassword(index, 'delete')}>Delete</button></td>
                    <td>View password</td>
                  </tr>
                ))
              }
              {
                this.props.employees.length === 0 &&

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
        />
        <FormLogin />
        <FormDelete
          deleted={() => this.deleteMember()}
        />
        <FormAskedPassword
          deleted={(index) => this.deleteMember(index)}
          changeStatus={(index) => this.changeStatus(index)}
          changeWorking={(index) => this.changeWorking(index)}
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
    token: state.session.token,
    employees: state.session.employees,
    fetchDate: state.session.fetchDate
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setToken: (token, email) => dispatch({type: 'SET_TOKEN', token: token, email: email}),
    updateEmployees: (employees) => dispatch({type: 'UPDATE_EMPLOYEES', employees: employees}),
    setup: (employees, fetchDate) => dispatch({type: 'SETUP', employees: employees, fetchDate: fetchDate}),
    setMemberAddTurnId: (index) => dispatch({type: 'SET_MEMBER_ADD_TURN', index: index}),
    setMemberAction: (index, action) => dispatch({type: 'SET_MEMBER_ACTION', index: index, action: action}),
  }
}

/*const SelectDate = () => {
  const [startDate, setStartDate] = useState(new Date());
  return (
    <DatePicker selected={startDate} onChange={date => setStartDate(date)} />
  );
};*/

export default connect(mapStateToProps, mapDispatchToProps)(WithErrorHandler(App, axios));
