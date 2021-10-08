import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
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

    initializeMaster(): Observable<any[]> {
        this.restApiService.get(PathConstants.DaysMaster_Get).subscribe(res => {
            this.days = res;
        });
        this.restApiService.get(PathConstants.MasterAll_Get).subscribe(master => {
            this.data = master;
        })
        // setTime
        // setTimeout(this.data = function () {
        //     return this.data;
        // }, 1000);
        return of(this.data);
    }

    getMaster(type): any {
        console.log('inside master')
        console.log('master', this.data);
        this.masterData = [];
        switch (type) {
            case 'DT':
                this.data.Table.forEach(d => {
                    this.masterData.push({ name: d.DistrictName, value: d.Districtcode });
                })
                break;
            case 'TK':
                this.data.Table1.forEach(t => {
                    this.masterData.push({ name: t.Talukname, code: t.Talukid });
                })
                break;
            case 'HT': 
                this.data.Table2.forEach(h => {
                    this.masterData.push({ name: h.Name, code: h.HTypeId });
                })
                break;
            case 'GD':
                this.data.Table3.forEach(g => {
                    this.masterData.push({ name: g.Name, code: g.Id });
                })
                break; 
            case 'QT':
                this.data.Table4.forEach(q => {
                    this.masterData.push({ name: q.Name, code: q.Id });
                })
                break;
            case 'AY':
                this.data.Table5.forEach(a => {
                    this.masterData.push({ name: a.ShortYear, code: a.Id });
                })
                break;
                case 'CM':
                    this.data.Table6.forEach(c => {
                        this.masterData.push({ name: c.Name + '/' + c.NameTamil, code: c.Id });
                    })
                    break;
            case 'RL':
                this.masterData = [
                    { label: '-select-', value: null },
                    { label: 'Christian', value: 'Christian' },
                    { label: 'Hindu', value: 'Hindu' },
                    { label: 'Muslim', value: 'Muslim' },
                    { label: 'Others', value: 'Others' },
                ];
                break;
            case 'CS':
                this.masterData = [
                    { label: '-select-', value: null },
                    { label: 'MBC', value: 'MBC' },
                    { label: 'BC', value: 'BC' },
                    { label: 'OC', value: 'OC' },
                    { label: 'SC/ST', value: 'SC' },
                ];
                break;
            case 'BG':
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
            case 'FD':
                this.days.forEach(d => {
                    this.masterData.push({ name: d.Name + ' / ' + d.NameTamil, code: d.slno });
                })
                break;
        }
        return this.masterData;
    }
}