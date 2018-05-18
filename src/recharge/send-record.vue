<template>
  <div class="record tab-panel active">
    <div ref="curve" class="curve">
      <p>发送曲线
        <span class="ri">仅保留最近30天数据</span>
      </p>
      <div class="v-line">
        <div id="echart" style="height:260px;"></div>
      </div>
    </div>
    <div class="log">
      <p>发送日志</p>
      <table>
        <thead>
          <tr>
            <th>国别码</th>
            <th>手机号</th>
            <th>短信内容</th>
            <th>扣除条数</th>
            <th>类型</th>
            <th>状态</th>
            <th>提交时间</th>
          </tr>
        </thead>
        <tbody>
           <tr v-for="(record, key) in records" :key="key">
            <td>{{record.countrycode}}</td>
            <td>{{record.phone}}</td>
            <td>{{record.content}}</td>
            <td>{{record.consume}}</td>
            <td>{{record.type}}</td>
            <td>
              <i class="iconfont" :class="record.statucode == '100' ? 'success' : 'error'">
                {{record.statucode == '100' ? '&#xe652;' : '&#xe70d;'}}
                <span v-if="record.statucode != '100'">错误码{{record.statucode}}</span>
              </i>
            </td>
            <td>{{record.createtime | dateString}}</td>
          </tr>
        </tbody>
      </table>
      <pagination :current-page.sync="page" :page-total="pageTotal" @change="loaddata"></pagination>
    </div>
  </div>
</template>

<script>
import axios from "@/lib/axios";
import dateString from "@/filters/date-string";
import pagination from "@/components/pagination.vue";

export default {
  filters: { dateString },
  data() {
    return {
      page: 1,
      pageTotal: 0,
      records: [],
      statistics: [],
      scale: [{ dataKey: "count" }, { dataKey: "date", }],
      label: {textStyle: {textAlign: 'center', color: 'red'}},
      chart: null
    };
  },
  created() {
    this.loaddata(1);    
  },
  methods: {
    loaddata(page) {
      axios
        .get(
          "/plugin.php?id=phone_auth&action=smsdata&type=send&page=" +
            (page - 1)
        )
        .then(({ data }) => {
          this.pageTotal = Math.ceil(data.total / 20);
          this.records = data.records;
          this.statistics = data.statistics;
          this.$nextTick(this.renderChart)
        });
    },
    renderChart() {
      var myChart = echarts.init(document.getElementById('echart'));
      var dates = [];
      var counts = [];
      for (var i = 0; i < this.statistics.length; i++) {
        dates.push(this.statistics[i].date);
        counts.push(this.statistics[i].count);
      }
      var option = {
        color: ['#0088ff'],
        grid: {
          left: 50,
          top: 20,
          right: 50
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          width: this.$refs.curve.clientWidth + 'px'
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: dates
        },
        yAxis: {
          type: 'value',
        },
        series: [{
          name: '发送数量',
          type: 'line',
          smooth: true,
          data: counts
        }]
      };
      myChart.setOption(option);
      this.$nextTick(() => {
        myChart.resize({
          width: this.$refs.curve.clientWidth
        })
      })
      window.onresize = () => {
        myChart.resize({
          width: this.$refs.curve.clientWidth
        })
      };
    }
  },
  components: {
    pagination
  }
};
</script>
