import { Component } from '@angular/core';
import * as XLSX from 'xlsx';
import * as Highcharts from 'highcharts';
import highcharts3D from 'highcharts/highcharts-3d.src';
import * as Provinces from 'src/assets/iller';
// @ts-ignore
highcharts3D(Highcharts);

interface IAnswer {
  name: string,
  value: number
}

interface IData {
  name: string,
  y: number,
  sliced?: boolean,
  selected?: boolean,
  color?: string
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  Highcharts: typeof Highcharts = Highcharts;
  chart!: Highcharts.Chart;

  answerList: IAnswer[] = [
    {
      name: 'Evet / Hayır Cevaplar',
      value: 1
    },
    // {
    //   name: 'Numerik Cevaplar',
    //   value: 2
    // },
    {
      name: 'Kategori Seçiniz..',
      value: 0
    }];

  selectedAnswer: IAnswer = { name: '-', value: 0 };

  questionList: string[] = [];

  dataSource: any[] = [];

  selectedQuestion = '';

  yesAnswerCount = 0;
  noAnswerCount = 0;

  name = 'This is XLSX TO JSON CONVERTER';
  willDownload = false;

  tableDataSource = [];
  tableHeaderList: string[] = [];
  provinceList = Provinces;

  getPieChartOptions = (): Highcharts.Options => {
    return {
      chart: {
        type: 'pie',
        width: 600,
        height: 400
      },
      title: {
        text: this.selectedQuestion,
        style: {
          fontSize: '21px',
          fontFamily: 'Helvetica'
        }
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
            format: '<b>{point.name}</b>: {point.percentage:.1f} %',
            style: {
              fontSize: '21px',
              fontFamily: 'Helvetica'
            }
          },

        },

      },
      credits: {
        enabled: false
      }
    }
  }
  fileName: any;

  onSelectFile(event: any) {

    let workBook: any = null;
    let jsonData = null;
    const reader = new FileReader();
    const file = event.target.files[0];
    // console.log('file geldi.: ', file);
    this.fileName = file.name

    reader.onload = (event) => {
      const result = reader.result;

      workBook = XLSX.read(result, { type: 'binary' });

      jsonData = workBook.SheetNames.reduce((initial: any, name: string) => {
        const sheet = workBook.Sheets[name];
        initial[name] = XLSX.utils.sheet_to_json(sheet);
        return initial;
      }, {});
      const dataString = JSON.stringify(jsonData, null, 2);
      // console.log(dataString);

      if (jsonData['Form Responses']) {
        this.dataSource = jsonData['Form Responses'];
      }
    }
    reader.readAsBinaryString(file);

  }

  drawChart() {

    let data: IData[];

    if (this.selectedAnswer.value === 1) {
      data = [
        {
          name: 'Evet',
          y: this.yesAnswerCount,
          color: '#673ab7'

        },
        {
          name: 'Hayır',
          y: this.noAnswerCount,
          color: '#e5d6ff'
        },
      ];

      const chartOption = this.getPieChartOptions();

      chartOption.series = [
        {
          name: this.selectedQuestion,
          data: data
        }
      ] as Array<Highcharts.SeriesPieOptions>;;

      setTimeout(() => {
        this.chart = Highcharts.chart('graph-1', chartOption)
      });

    }



  }

  createQuestions() {
    this.questionList = [];

    if (this.dataSource.length > 0) {

      console.log('DATAAAAA: ', this.dataSource);


      if (this.selectedAnswer.value === 1) {

        const obj = this.dataSource[0];
        for (const [key, value] of Object.entries(obj)) {

          if (value === 'Evet' || value === 'Hayır') {
            this.questionList.push(key);
          }
        }
      } else if (this.selectedAnswer.value === 2) {

        const obj = this.dataSource[0];
        for (const [key, value] of Object.entries(obj)) {

          if (typeof value === 'number') {
            this.questionList.push(key);
          }
        }
      }

      console.log('question list: ', this.questionList);

    } else {
      console.log('DOSYADA VERİ BULUNAMADI!')
    }

  }

  onSelectedQuestion() {

    this.yesAnswerCount = 0;
    this.noAnswerCount = 0;

    this.dataSource.forEach((element) => {
      if (this.selectedAnswer.value === 1) {
        if (element[this.selectedQuestion] === 'Evet') {
          this.yesAnswerCount++;

        } else if (element[this.selectedQuestion] === 'Hayır') {
          this.noAnswerCount++;
        }

      }
    });

    this.drawChart();
  }

  getYesOrNotAnswersOfProvinceList() {
    this.tableHeaderList = ['yes', 'no'];
  }

}
