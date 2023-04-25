import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NavParams } from '@ionic/angular';
import { Service } from 'src/app/interfaces/service';
import { AlertService } from 'src/app/services/alert.service';
import { ServicesService } from 'src/app/services/services.service';

@Component({
  selector: 'app-knowledge-detail',
  templateUrl: './knowledge-detail.page.html',
  styleUrls: ['./knowledge-detail.page.scss'],
})
export class KnowledgeDetailPage implements OnInit {
  id=""

  serviceForm = new FormGroup({
    problem: new FormControl('', [Validators.required, Validators.minLength(6)]),
    solution: new FormControl('', [Validators.required, Validators.minLength(6)]),
    time: new FormControl(0, [Validators.required]),
  });

  constructor(private params: NavParams,private serviceService:ServicesService,private alertService:AlertService) {
    if(params.get('service')){
      let s:Service=params.get('service');
      this.id=s.id;
      this.serviceForm.setValue({
        problem: s.problem,
        solution: s.solution,
        time: s.time,
      });
    }
  }

  ngOnInit() {
  }

  save(){
    let u:Service={
      id: this.id,
      problem: this.serviceForm.controls['problem'].value!,
      solution: this.serviceForm.controls['solution'].value!,
      time: this.serviceForm.controls['time'].value!,
      date:new Date().getDate()+"/"+new Date().getMonth()+"/"+new Date().getFullYear(),
      createdDate: new Date(),
    };
    if(this.id.length>0)
      this.serviceService.put(u).then(()=>{
        this.alertService.successful('Se ha actualizado el servicio');
      });
    else
    this.serviceService.add(u).then(()=>{
      this.alertService.successful('Se ha agregado el servicio');
    });
    this.params.get('modal').dismiss();
  }

}
