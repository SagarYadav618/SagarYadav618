import { Component, OnInit } from '@angular/core';
import {VaccineService} from '../home/vaccine.service';
import { District, RootObjectDistrict } from './models/districtModel';
import { RootObjectSession,Session } from './models/sessionModel';
import { RootObjectStates, State } from './models/statesModel';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {


  //Based on value UI will be displayed
  searchByDistrict!: boolean;
  searchByPin!: boolean;
  showSearchedRecordsByDistrict!: boolean;
  showSearchedRecordsByPincode!: boolean;


  //object for storing result of API
  allStates : RootObjectStates | any;
  myStateArray: State[]=[];
  allDistricts : RootObjectDistrict | any;
  myDistrictsArray : District[]=[];
  allSessions : RootObjectSession | any;
  mySessionArray: Session[]=[];

  allSessions2: RootObjectSession | any;
  mySessionArray2: Session[]=[];



  //Storing count of district , state and session for looping
  districtCount!: number;
  stateCount!: number;
  sessionCount!: number;



  state_id!: number;
  district_id!: number;

  //used to store pincode for API
  pincode: number | any;

  //Varibles for finding today Date
  today!: Date;
  date!: number;
  month!: number;
  year!: number;
  finalDate!: string;


  //Varibles for finding today Date
  vaccine = ["COVAXIN","COVISHIELD","SPUTNIK V"]
  ageGroup = [18,45];
  vaccineType!: string;
  ageLimit!: number;


  constructor(private vaccineService:VaccineService) { }

  ngOnInit(): void {
    this.searchByPin = false;
    this.searchByDistrict = false;
    this.showSearchedRecordsByDistrict=false;
    this.showSearchedRecordsByPincode=false;
    this.today = new Date();
    this.date = this.today.getDate();
    this.month = this.today.getMonth()+1;
    this.year = this.today.getFullYear();
    this.finalDate = this.date + '-' + this.month +'-' +this.year;
    this.vaccineType = "COVAXIN";
    this.ageLimit = 18;
    this.getStates();
  }


  // Search by District
  showFindByDistrictForm(){

    this.searchByDistrict = true;
    this.searchByPin = false;
    this.showSearchedRecordsByDistrict = false;
    this.showSearchedRecordsByPincode = false;



  }

  // Search by pincode
  showFindByPinForm(){

    this.searchByPin = true;
    this.searchByDistrict = false;
    this.showSearchedRecordsByDistrict = false;
    this.showSearchedRecordsByPincode = false;

  }


   //Get States from API
   getStates():void
   {
     this.vaccineService.getStates()
       .subscribe(response => {this.allStates = response.body
       this.stateCount = this.allStates.states.length;
         for(var i=0;i<this.stateCount;i++)
         {
           this.myStateArray[i] = this.allStates.states[i];
         }
       });
   }





    //On Selecting State Find Districts
    onSelectState(event:any)
    {
      this.mySessionArray=[];
      this.state_id = event.target.value;
      this.vaccineService.getDistricts(this.state_id)
        .subscribe(response => {this.allDistricts = response.body
        this.districtCount  = this.allDistricts.districts.length;
        for(var i=0;i<this.districtCount;i++)
        {
            this.myDistrictsArray[i] = this.allDistricts.districts[i];
        }
        });
    }


    //On Selecting District Find Vaccine Slots
    onSelectDistrictFindSlot(event:any)
    {
      this.pincode = null;
      this.mySessionArray=[];
      this.mySessionArray2=[];
        this.district_id = event.target.value;
        this.vaccineService.getSessionByDistrict(this.district_id,this.finalDate)
          .subscribe(response=> {
            this.allSessions = response.body
            this.sessionCount = this.allSessions.sessions.length;
            for(var i=0;i<this.sessionCount;i++)
            {
              this.mySessionArray[i] = this.allSessions.sessions[i];
            }
            if(this.sessionCount>0)
            {
              this.showSearchedRecordsByDistrict = true;
              this.showSearchedRecordsByPincode = false;
            }
          
          });
    }

  //For filtering output based on vacccine selected
  onVaccineSelected(event:any)
  {
    this.vaccineType = event.target.value;
  }

  //For filtering output based on Age Group Selected
  onAgeGroupSelected(event:any)
  {
    this.ageLimit = event.target.value;
    //console.log(this.ageLimit);
  }

  //Find Slot By Pincode
  findByPincode(event:any)
  {
      this.mySessionArray2=[];
      this.pincode = event.target.value;
      //console.log(this.pincode)
      if(this.pincode.toString().length==6)
      {
        this.pincode = event.target.value;
        this.vaccineService.getSessionByPin(this.pincode,this.finalDate)
        .subscribe(response=> {
          this.allSessions2 = response.body
          this.sessionCount = this.allSessions2.sessions.length;
          for(var i=0;i<this.sessionCount;i++)
          {
            this.mySessionArray2[i] = this.allSessions2.sessions[i];
          }
          if(this.sessionCount>0)
          {
            this.showSearchedRecordsByDistrict = false;
            this.showSearchedRecordsByPincode = true;
          }
    
        });
      }
  }

}
