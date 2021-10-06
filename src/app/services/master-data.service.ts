import { Injectable } from '@angular/core';
import { PathConstants } from '../Common-Modules/PathConstants';
import { RestAPIService } from './restAPI.service';

@Injectable({
    providedIn: 'root'
})

export class MasterService {
    masterData?: any = [];
    days?: any = [];
    data?: any = [];

    constructor(private restApiService: RestAPIService) { }

    initializeMaster() {
        this.restApiService.get(PathConstants.DaysMaster_Get).subscribe(res => {
            this.days = res;
        });
        this.restApiService.get(PathConstants.MasterAll_Get).subscribe(master => {
            this.data = master;
        })

    }

    getMaster(type): any {
        this.masterData = [];
        switch (type) {
            case 'D':
                this.data.Table.forEach(d => {
                    this.masterData.push({ name: d.DistrcitName, value: d.Districtcode });
                })
                break;
            case 'T':
                this.data.Table1.forEach(t => {
                    this.masterData.push({ name: t.Talukname, code: t.Talukid });
                })
                break;
            case 'G':
                this.masterData = [
                    { label: '-select-', value: null },
                    { label: 'Female', value: 'Female' },
                    { label: 'Male', value: 'Male' },
                    { label: 'Transgender', value: 'Transgender' },
                ];
                break;
            case 'B':
                this.masterData = [
                    { label: '-select-', value: null },
                    { label: 'A+', value: 'A+' },
                    { label: 'A-', value: 'A-' },
                    { label: 'AB+', value: 'AB+' },
                    { label: 'AB-', value: 'AB-' },
                    { label: 'B+', value: 'B+' },
                    { label: 'B-', value: 'B-' },
                    { label: 'O+', value: 'O+' },
                    { label: 'O-', value: 'O-' },
                ];
                break;
            case 'MT':
                this.masterData = [
                    { label: '-select-', value: null },
                    { label: 'Tamil', value: 'Tamil' },
                    { label: 'English', value: 'English' },
                    { label: 'Others', value: "Others" },
                ];
                break;
            case 'F':
                this.days.forEach(d => {
                    this.masterData.push({ name: d.Name + ' / ' + d.NameTamil, code: d.slno });
                })
                break;
        }
    }
}