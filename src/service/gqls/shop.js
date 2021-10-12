import gql from 'graphql-tag';

export const shopGql = gql`
query storeLocations($province: String, $city: String, $area: String, $storeType: StoreType){
    shop{
            storeLocations(provinceCode: $province, cityCode: $city,
              areaCode: $area, storeType: $storeType){
                storeCode
                locationName
                address
                phone
                    businessDays{
                    weekDays
                        hoursList{
                            startTime
                            endType
                            endTime
                        }
                    }
                latitude
                longitude
                provinceName
                provinceCode
                cityName
                cityCode
                areaName
                storeStatus
            }
        }
    }
`
