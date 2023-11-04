import * as fs from 'fs';
import { MockRequests } from "./api_request/t4sg_mock";
import { HelpRequest } from './api_request/models';
interface Data {
    x: number;
    y: number;
}


// read file synchronously 
function readJSON() {
    const data:Data[] = [];
    const callers:HelpRequest[] = MockRequests();
    callers.forEach(function (caller) {
        data.push({x: caller.location.latitude, y: caller.location.longitude});
    }); 
    return data;
}
