import { Component, input, effect, signal, output, inject, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgApexchartsModule } from 'ng-apexcharts';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexTitleSubtitle,
  ApexStroke,
  ApexFill,
  ApexTooltip,
  ApexGrid,
  ApexTheme,
  ApexMarkers
} from 'ng-apexcharts';
import { UsageStat } from '../../../../core/models/api.models';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  title: ApexTitleSubtitle;
  stroke: ApexStroke;
  fill: ApexFill;
  tooltip: ApexTooltip;
  grid: ApexGrid;
  theme: ApexTheme;
  colors: string[];
  markers: ApexMarkers;
};

@Component({
  selector: 'app-usage-chart',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  templateUrl: './usage-chart.html'
})
export class UsageChart {
  private zone = inject(NgZone);
  
  readonly stats = input.required<UsageStat[]>();
  readonly chartOptions = signal<Partial<ChartOptions>>({});

  readonly monthSelect = output<string>();

  constructor() {
    effect(() => {
      const data = this.stats();
      this.updateChart(data);
    });
  }

  private updateChart(data: UsageStat[]) {
    // Aggregate by month
    const aggregated = data.reduce((acc, curr) => {
      const month = new Date(curr.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
      if (!acc[month]) {
        acc[month] = 0;
      }
      acc[month] += curr.totalTokens;
      return acc;
    }, {} as Record<string, number>);

    const categories = Object.keys(aggregated);
    const seriesData = Object.values(aggregated);

    this.chartOptions.set({
      series: [{
        name: "Tokens",
        data: seriesData
      }],
      chart: {
        height: 350,
        type: "area",
        fontFamily: "Inter, sans-serif",
        toolbar: {
          show: false
        },
        background: 'transparent',
        events: {
          markerClick: (event, chartContext, config) => {
             const selectedIndex = config.dataPointIndex;
             const selectedCategory = categories[selectedIndex];
             this.zone.run(() => {
                this.monthSelect.emit(selectedCategory);
             });
          },
          dataPointSelection: (event, chartContext, config) => {
             const selectedIndex = config.dataPointIndex;
             const selectedCategory = categories[selectedIndex];
             this.zone.run(() => {
                this.monthSelect.emit(selectedCategory);
             });
          }
        }
      },
      markers: {
        size: 5,
        colors: ['#06b6d4'],
        strokeWidth: 3,
        hover: {
          size: 7
        }
      },
      colors: ['#06b6d4'], // brand-500
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.2,
          stops: [0, 90, 100]
        }
      },
      stroke: {
        curve: "smooth",
        width: 2
      },
      grid: {
        borderColor: '#334155', // slate-700
        strokeDashArray: 4,
        yaxis: {
          lines: {
            show: true
          }
        }
      },
      xaxis: {
        categories: categories,
        labels: {
          style: {
            colors: '#94a3b8' // slate-400
          }
        },
        axisBorder: { show: false },
        axisTicks: { show: false }
      },
      theme: {
        mode: 'dark'
      },
      tooltip: {
         theme: 'dark',
         y: {
            formatter: (val) => `${(val / 1000).toFixed(1)}k`
         }
      }
    });
  }
}
