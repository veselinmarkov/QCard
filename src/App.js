import {Container, Avatar, Typography, Grid, TextField,
  FormControlLabel, Switch, CssBaseline, Button} from '@material-ui/core';
import RotateRightTwoTone from '@material-ui/icons/RotateRightTwoTone';
import { Component } from 'react';
import { getAllforUser, getInfo, getWord, saveRecord, getLast5forUser } from './api/wordsdb';
import QCard from './components/QCard';
import { ResultTable } from './components/ResultTable';
import { ResultTimeChart } from './components/ResultTimeChart';
import Navbar from './components/Navbar';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      active : false,
      maxWords : null,
      remain : 0,
      dialog: false,
      lastCards: [],
      user: { id:"Guest" }, //{id, firstName, lastName}
      debug: "",
      report: "",
    }
    this.notifPermit = false;
    this.notif =null;
    this.time_var = null;
    this.record =null;
    this.listShouldRefresh = true;
  }

  componentDidMount() {
    getInfo().then((res) => {
      //console.log(JSON.stringify(res.data.doc_count +' words found in the DB');
      this.setState({...this.state,  maxWords: res.data.docCount, user: res.data.isAuth ? res.data.user : { id:"Guest" }, 
        report: 'A total of ' +res.data.docCount +' words found in the DB'});
    }).catch((err) => {
      this.setState({...this.state, report: 'No connection to word DB:' +String(err ? err : "")});
      //this.putMessage('No connection to word DB:' +String(err ? err : ""));
    });    
  };

  componentDidUpdate() {
    if (this.state.dialog)
      return;
    //console.log('Did Mount invoked. Dialog:' + this.state.dialog);
    if (this.state.active && this.state.remain >0) {
      setTimeout( () => this.setState((state) =>{ 
        return {debug: String(state.remain) + " seconds to show a Card",remain : state.remain -1 }
      }), 1000);
    } else if (this.state.active)
      this.popBox();
    this.refreshCardList();    
  }

  refreshCardList = () => {
    if (this.listShouldRefresh) {
      Promise.all([getLast5forUser(this.state.user.id), getAllforUser(this.state.user.id)]).then((res) => {
        this.setState({...this.state, lastCards: res[0], allCards: res[1]});
        //console.log(JSON.stringify(res[1]));
      }).catch((err) => {
        //this.setState({...this.state, report: 'Error from API: ' +String(err)});
        //this.putMessage('Error from API: ' +String(err));
        console.log("Error fromAPI:"+ String(err));
          //+" lastCards:" +String(this.state.lastCards) +" allCards:" +String(this.state.allCards));
      });
      this.listShouldRefresh =false;
    }
  }

  getRandom =() => {
    let intr = Number(document.getElementById("interval").value) ;
    let rnd = Math.floor(Math.random() * 10 * 60) + intr * 60;
    //console.log('Next card in '+ String(rnd) +' seconds');
    return rnd;
  }

  changeswitch = (event)=> {
    let swch_state = event.target.checked;
    //console.log('Switch changed to:' + String(swch_state));
    //this.putMessage((swch_state) ? "Question cards activated" : "Question cards disabled");
    if (swch_state) {
      let rnd = this.getRandom();
      this.setState({...this.state, active: swch_state, remain: rnd,
        report: (swch_state) ? "Question cards activated" : "Question cards disabled"});
      console.log('notification permission: ' + Notification.permission);
      if ('Notification' in window && Notification.permission === "default") {
        Notification.requestPermission();
        /* Notification.requestPermission().then((permission) =>{ 
          this.notifPermit = (permission === 'granted');        
          console.log('permission: ' +permission);
        }); */
      }
    } else {
      this.setState({...this.state, active: swch_state});
      if ( this.time_var )
        window.clearTimeout(this.time_var);
    }
  }

  popBox = (reentry) => {
    //console.log('Invoked popBox');
    if (this.record) {
      console.log('Cannot pop another box. There is active record. Setting up a new timer !');
      this.setState({...this.state, remain: this.getRandom()});
      return;
    }
    let easyHard = Math.floor(Math.random() * 2); // 0 - easy, 1 - hard
    let rnd;
    if (! easyHard)
      rnd = Math.floor(Math.random() * 1000);
    else {
      let amplitude = this.state.maxWords - 1000;
      rnd = Math.floor(Math.random() * amplitude) + 1000;
    }
    getWord(rnd).then((res) => {
      if ( Object.keys(res).length === 0) {
      } else {
        this.record = {
          user: this.state.user.id,
          word: res.data.german,
          correct: res.data.english,
          answer: null,
          difficulty: easyHard ? "Hard" : "Easy",
        }
        //show the flash Card
        this.setState({...this.state, dialog: true});
        if (document.visibilityState === 'hidden')
          this.notify();
      }
    }).catch((err) => {
      if (String(err).indexOf('missing') > -1) {
        console.log('Empty record hit id:'+ String(rnd));
        //console.log(JSON.stringify(err));
        if (!reentry)
          reentry =1;
        if (reentry < 5) {
          reentry ++;
          this.popBox(reentry); //try again
        }
      } else
        this.setState({...this.state, report: 'No connection to word DB:' +String(err)});
    })
  }

  notify =() =>{
    if (this.notif) {
      //console.log('Active notification, no need of new one');
      return;
    }
    if ('Notification' in window && Notification.permission === "granted") {
      //console.log('Sent notification');
      this.notif = new Notification('You have a new quesion card');
      this.notif.onclose = () => {
        //console.log('notification cleared');
        this.notif =null;
      };
      this.notif.onclick = () => {
        //console.log('focus requested');
        window.focus();
      }
    }
  }

  handleDialog = (ret) => {
    //console.log('App.handleDialog invoked answer: ' + ret);
    let report;
    if (! ret) {
      report = "No feedback";
      this.record =null;
    } else if (this.record) {
      let correctList = String(this.record.correct).split(",");
      if ( correctList.indexOf(ret) > -1 ) {
        this.record.wasCorrect = true;
        report = "The answer is correct";
      } else {
        this.record.wasCorrect = false;
        report = "Not correct";
      }
    }
    this.setState({...this.state, dialog: false, 
      remain: this.getRandom(), report: report});
    if (ret && this.record) {
      this.record.answer =ret;
      saveRecord(this.record).then(() => {
        //clear the record
        this.record =null;
        //console.log("Record saved");
        this.listShouldRefresh =true;
        this.refreshCardList();
      }).catch((err) => {
        console.log(String(err));
        this.record =null;
      });
    }
  }

  handleUser =  (user)=> {
      this.listShouldRefresh = true;
      this.setState({...this.state, user : user});
  }

  realSamples = [{"_id":"2021-06-24T16:13:37.293Z","word":"Linie","correct":"line","answer":"unknown","wasCorrect":false},
  {"_id":"2021-06-25T07:38:23.226Z","word":"Stadt","correct":"city","answer":"city","wasCorrect":true},
  {"_id":"2021-06-25T07:40:14.214Z","word":"wünschen","correct":"wish","answer":"want","wasCorrect":false}];

  render() {
    return (
      <Container component="main" maxWidth="sm" style={{paddingTop: "0px", border: "2px solid #e34d7d", borderRadius: "7px"}}>
        <CssBaseline />
        <Navbar user={this.state.user} updateUser={this.handleUser}/>
        <Grid container spacing={3} style={{margin: "20px -10px 5px"}}>
          <Grid container justify="center" sm={6}>
            <Avatar style={{backgroundColor: "#e34d7d"}}>
              <RotateRightTwoTone />
            </Avatar>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography component="h1" variant="h5">
              Flash card generator
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              name="Interval"
              variant="outlined"
              id="interval"
              label="Card minimum interval, minutes"
              type="number"
              defaultValue="3"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControlLabel
              control={<Switch checked={this.state.active} color="primary" onChange={this.changeswitch} disabled={this.state.maxWords ===null} id="activeswitch"/>}
              label="Activate the generator"/>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button variant="contained" color="primary" onClick={this.popBox} disabled={this.state.active}>
              Call a Card
            </Button>            
          </Grid>
          <Grid item xs={12} style={{paddingTop: "0px"}}>
            <ResultTable data={this.state.lastCards}/>  
          </Grid>
          <Grid item xs={12} style={{border: "1px solid #ccc", paddingTop: "0px", paddingBottom: "0px"}}>
            {/*<ResultCharts data={this.sampleData}/>*/}
            <ResultTimeChart data={this.state.allCards}/>
          </Grid>
          <Grid item xs={12}>
            <Typography component="h3" id="report">
              {this.state.report}
            </Typography>
            <Typography component="h3" id="debug">
              {this.state.debug}              
            </Typography>
          </Grid>
        </Grid>
        <QCard open={this.state.dialog} language="English" 
          word={this.record ? this.record.word : ""} difficulty={this.record ? this.record.difficulty : ""} 
          result={this.handleDialog}/>
      </Container>
    );
  }
}

export default App;
