import { Component, OnInit, ViewChild } from '@angular/core';
import Chart from 'chart.js/auto';
import { Incidencia } from 'src/app/interfaces/incidencia';
import { IncidenciasService } from 'src/app/services/incidencias.service';

@Component({
  selector: 'app-resports',
  templateUrl: './resports.page.html',
  styleUrls: ['./resports.page.scss'],
})
export class ResportsPage implements OnInit {
  @ViewChild('statusChart') statusChart;
  @ViewChild('tecnicoChart') tecnicoChart;
  @ViewChild('userChart') userChart;

  bars: any;
  colorArray: any;

  initialDate = new Date('2023-01-01').toISOString().substring(0, 10)
  finishDate = new Date().toISOString().substring(0, 10)
  today = new Date().toISOString().substring(0, 10)

  incidencias: Incidencia[] = [];
  incidenciasFiltered: Incidencia[] = [];
  constructor(private incidenciaService: IncidenciasService) { }

  ngOnInit() {
    this.incidenciaService.getAll().subscribe(i => {
      this.incidencias = i;
      this.filter()
    })
  }

  ionViewDidEnter() {
  }

  changeInitialDate(e: any) {
    this.initialDate = e.detail.value;
    this.filter()
  }

  changeFinishDate(e: any) {
    this.finishDate = e.detail.value;
    this.filter()
  }

  filter() {
    let filter: Incidencia[] = [];
    this.incidencias.forEach(i => {
      let d = new Date(0)
      d.setUTCSeconds(i.creationDate['seconds']);
      let finishDate = new Date(this.finishDate);
      finishDate.setDate(finishDate.getDate() + 1)
      if (d > new Date(this.initialDate) && d < finishDate) {
        filter.push(i);
      }
    })
    this.incidenciasFiltered = filter;
    this.createBarStatus();
    this.createBarTecnico();
    this.createBarUser();
  }

  createBarStatus() {
    let totals = [0, 0, 0, 0, 0, 0, 0, 0, 0]
    this.incidenciasFiltered.forEach(i => {
      totals[i.status] += 1;
    })
    this.bars = new Chart(this.statusChart.nativeElement, {
      type: 'bar',
      data: {
        labels: ['Creadas', 'Prioridad Asignada', 'Técnico Asignado', 'Incidencia Terminada', 'Incidencia Liberada', 'Con Solicitud de Cambio', 'Solicitud de Cambio Aceptada', 'Solicitud de Cambio Rechazada', 'Incidencia Rechazada'],
        datasets: [{
          label: 'Total de incidencias por estado',
          data: totals,
          backgroundColor: 'rgb(56,128,255)', // array should have same number of elements as number of dataset
          borderColor: 'rgb(56,128,255)',// array should have same number of elements as number of dataset
          borderWidth: 1
        }]
      }
    });
  }

  createBarTecnico() {
    let values = new Map<string, number>([])

    this.incidenciasFiltered.forEach(i => {
      if (i.tecnico != null)
        if (values.has(i.tecnico?.name + " " + i.tecnico?.lastname))
          values[i.tecnico?.name + " " + i.tecnico?.lastname] += 1;
        else
          values.set(i.tecnico?.name + " " + i.tecnico?.lastname, 1);
    })
    let labels: string[] = [];
    let totals: number[] = [];
    values.forEach((v: number, k: string) => {
      labels.push(k);
      totals.push(v);
    })

    this.bars = new Chart(this.tecnicoChart.nativeElement, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Total de incidencias por tecnico',
          data: totals,
          backgroundColor: 'rgb(56,128,255)', // array should have same number of elements as number of dataset
          borderColor: 'rgb(56,128,255)',// array should have same number of elements as number of dataset
          borderWidth: 1
        }]
      }
    });
  }


  createBarUser() {
    let values = new Map<string, number>([])

    this.incidenciasFiltered.forEach(i => {
      if (i.user != null)
        if (values.has(i.user?.name + " " + i.user?.lastname))
          values[i.user?.name + " " + i.user?.lastname] += 1;
        else
          values.set(i.user?.name + " " + i.user?.lastname, 1);
    })
    let labels: string[] = [];
    let totals: number[] = [];
    values.forEach((v: number, k: string) => {
      labels.push(k);
      totals.push(v);
    })

    this.bars = new Chart(this.userChart.nativeElement, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Total de incidencias por usuario',
          data: totals,
          backgroundColor: 'rgb(56,128,255)', // array should have same number of elements as number of dataset
          borderColor: 'rgb(56,128,255)',// array should have same number of elements as number of dataset
          borderWidth: 1
        }]
      }
    });
  }

}
