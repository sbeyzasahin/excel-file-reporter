import { Component } from '@angular/core';
import * as XLSX from 'xlsx';
import * as Highcharts from 'highcharts';
import highcharts3D from 'highcharts/highcharts-3d.src';
// @ts-ignore
highcharts3D(Highcharts);
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  Highcharts: typeof Highcharts = Highcharts;
  chart!: Highcharts.Chart;

  answerList: string[] = ['Evet / Hayır', 'Numerik Cevaplar'];
  selectedAnswer: string = '-';


  name = 'This is XLSX TO JSON CONVERTER';
  willDownload = false;
  getPieChartOptions = (): Highcharts.Options => {
    return {
      chart: {
        type: 'pie'
      },
      title: {
        text: 'title'
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      },
      accessibility: {
        point: {
          valueSuffix: '%'
        }
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>: {point.percentage:.1f} %'
          }
        }
      },
    }
  }

  onSelectFile(event: any) {

    let workBook: any = null;
    let jsonData = null;
    const reader = new FileReader();
    const file = event.target.files[0];
    console.log('file geldi.: ', file);


    reader.onload = (event) => {
      const data = reader.result;

      workBook = XLSX.read(data, { type: 'binary' });

      jsonData = workBook.SheetNames.reduce((initial: any, name: string) => {
        const sheet = workBook.Sheets[name];
        initial[name] = XLSX.utils.sheet_to_json(sheet);
        return initial;
      }, {});
      const dataString = JSON.stringify(jsonData, null, 2);
      console.log(dataString);
    }
    reader.readAsBinaryString(file);


    // const chartOption = this.getPieChartOptions()
    // chartOption.series = []

    // setTimeout(() => {

    //   this.chart = Highcharts.chart('graph-1', chartOption);
    // });

  }


}
