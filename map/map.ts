import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
  props: {
    //传入的地址
     mapAddress:String,
     //传入的css
     className:String
  }
})
export default class MapComponent extends Vue {
  mapAddress:String;
  
  mounted() {
    let _this=this;
    var map = new AMap.Map('amapContainer', {
      resizeEnable: false,
      zoom: 13,
      zoomEnable:false,
      dragEnable: false,
      center: [116.39, 39.9]
    });
    AMap.plugin('AMap.Geocoder', function () {
      var geocoder = new AMap.Geocoder({
        city: " "//城市，默认：“全国”
      });
      var marker = new AMap.Marker({
        map: map,
        bubble: true
      })
      
      map.on('click', function (e:any) {
        marker.setPosition(e.lnglat);
        geocoder.getAddress(e.lnglat, function (status:any, result:any) {
          if (status == 'complete') {
            // console.log( e.lnglat.getLng() + ',' + e.lnglat.getLat())
             let query={
              coordinate:e.lnglat.getLng() + ',' + e.lnglat.getLat(),
              addressName: result.regeocode.formattedAddress
            
             }
            
            _this.$emit('message',query)
            //input.value = result.regeocode.formattedAddress
            //message.innerHTML = ''
            //this.$emit('address',result.regeocode.formattedAddress)
          } else {
            
          }
        })
      })
      
      geocoder.getLocation(_this.mapAddress, function (status:any, result:any) {
        if (status == 'complete' && result.geocodes.length) {
          //初始化得到需要的坐标和地区名称
          geocoder_CallBack(result)
        
          marker.setPosition(result.geocodes[0].location);
          map.setCenter(marker.getPosition())

        } else {
          //this.$emit('message','无法获取位置')
          //message.innerHTML = '无法获取位置'
        }
      })

      //地理编码返回结果展示
    function geocoder_CallBack(data:any) {
      var resultStr = "";
      //地理编码结果数组
      var geocode = data.geocodes;
      let query;
      for (var i = 0; i < geocode.length; i++) {
          //resultStr += "<span style=\"font-size: 12px;padding:0px 0 4px 2px; border-bottom:1px solid #C1FFC1;\">" + "<b>地址</b>：" + geocode[i].formattedAddress + "" + "&nbsp;&nbsp;<b>的地理编码结果是:</b><b>&nbsp;&nbsp;&nbsp;&nbsp;坐标</b>：" + geocode[i].location.getLng() + ", " + geocode[i].location.getLat() + "" + "<b>&nbsp;&nbsp;&nbsp;&nbsp;匹配级别</b>：" + geocode[i].level + "</span>";
            query={
            coordinate:geocode[i].location.getLng() + ", " + geocode[i].location.getLat(),
            addressName: geocode[i].formattedAddress
          
           }
          
      }
      _this.$emit('message',query)
    };
  }
  
}