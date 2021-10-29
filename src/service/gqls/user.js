import gql from "graphql-tag";

export const visitorLoginGql = gql`
  mutation visitorLogin {
    visitorLogin {
      token
      userErrors {
        code
        message
      }
    }
  }
`;

export const userLogin = gql`
  mutation wxUserLogin($userLoginInput: WXUserLoginInput) {
    wxUserLogin(userLoginInput: $userLoginInput) {
      token
      customer {
        id
        account
        email
        token
        mobile
      }
      userErrors {
        code
        message
      }
    }
  }
`;

export const userInfo = gql`
  query userInfo {
    customer {
      userInfo {
        data {
          account
          email
          mobile
          code
          isVisitor
          labels {
            code
            name
          }
        }
        extension {
          mobile
          birthday
          firstName
          lastName
          gender
          userRemark
        }
        userErrors {
          code
          message
        }
      }
    }
  }
`;

// 获取微信的登陆信息
export const getWechatMiniAppOpenId = gql`
  query getWechatMiniAppOpenId($input: getWechatMiniAppOpenIdInput!) {
    customer {
      thirdParty {
        getWechatMiniAppOpenId(input: $input) {
          data {
            openId
            sessionKey
          }
          userErrors {
            code
            message
          }
        }
      }
    }
  }
`;

export const getWechatMiniAppDecryptedPhone = gql`
  query getWechatMiniAppDecryptedPhone($input: encryptedForm!) {
    customer {
      thirdParty {
        getWechatMiniAppDecryptedPhone(input: $input) {
          data {
            country
            intPhone
            phone
          }
          userErrors {
            code
            message
          }
        }
      }
    }
  }
`;

// 发送短信验证码
export const sendNote = gql`
  mutation sendSmsCode($input: sendSmsCode!) {
    valentino {
      sendSmsCode(input: $input) {
        userErrors {
          code
          message
        }
      }
    }
  }
`;

// checkout短信验证码
export const checkNote = gql`
  mutation checkNote($input: CheckNoteInput!) {
    checkNote(input: $input) {
      userErrors {
        code
        message
      }
    }
  }
`;

export const updatePasswordGql = gql`
  mutation updatePassword($input: UpdatePasswordInput!) {
    updatePassword(input: $input) {
      userErrors {
        code
        message
        field
      }
    }
  }
`;

// 更新个人信息 - 更改登陆手机号
export const updateUserInfo = gql`
  mutation updateUserInfo($input: UpdateUserInfoInput!) {
    valentino {
      valentino_updateUserInfo(input: $input) {
        userErrors {
          code
          message
        }
      }
    }
  }
`;

// 获取地址列表

export const addresses = gql`
  query addresses {
    customer {
      addresses {
        id
        province
        provinceId
        city
        cityId
        district
        districtId
        town
        address
        receiverName
        receiverMobile
        isDefault
      }
    }
  }
`;

// 移除地址

export const removeAddress = gql`
  mutation deliveryAddressDelete($addressCode: String!) {
    deliveryAddressDelete(addressCode: $addressCode)
  }
`;

// 商品收藏
export const createFavorite = gql`
  mutation createFavorite($input: CreateFavoriteInput!) {
  	createFavorite(input: $input)
  }
`;

// 查询心愿单
export const fetchFavorites = gql`
  query fetchFavorites($page: Int = 1, $size: Int = 10) {
    customer {
      favorites(page: $page, size: $size) {
        data {
          id
          userCode
          spuCode
          price {
            amount
            currencyCode
          }
          collectionTime
        }
        userErrors {
          code
          message
        }
      }
    }
  }
`;

// 查询心愿单 带商品信息
export const fetchFavoritesDetail = gql`
  query favorites($pageInput: PageInput) {
  			customer {
  				favorites(pageInput: $pageInput) {
  					edges {
  						node {
  							product {
  								code
  								title
  								images {
  									url
  									type
  								}
  								skus {
  									salePrice {
  										amount
  										currencyCode
  									}
  								}
  								salePrice {
  									amount
  									currencyCode
  								}
  							}
  							id
  						}
  					}
  					pageInfo {
  						startCursor
  						endCursor
  						totalCount
  						hasNextPage
  					}
  				}
  			}
  		}
`;

// 删除心愿单
export const delFavorite = gql`
  mutation cancelFavorites($input: [String!]!) {
  	cancelFavorites(collectionCodes: $input)
  }
`;

// 一键清空失效商品
export const clearUseLess = gql`
  mutation clearUseLess {
    clearUseLess {
      userErrors {
        code
        message
      }
    }
  }
`;

// 查询收货地址列表
export const deliveryAddressesGql = gql`
  query deleverAdress($input: PageInput) {
    customer {
      deliveryAddresses(pageInput: $input) {
        edges {
          node {
            code
            isDefault
            countryId
            country
            provinceId
            province
            cityId
            city
            districtId
            district
            address
            receiverName
            receiverMobile
            addressVerify
          }
        }
      }
    }
  }
`;

export const deliveryAddressCreate = gql`
  mutation deliveryAddressCreate($input: DeliveryAddressCreateInput!) {
    deliveryAddressCreate(input: $input) {
      code
      addressVerify
      isDefault
    }
  }
`;
export const deliveryAddressUpdate = gql`
  mutation deliveryAddressUpdate($input: DeliveryAddressUpdateInput!) {
    deliveryAddressUpdate(input: $input) {
      code
      isDefault
    }
  }
`;

// 验证手机号是否注册
export const isExistMobilePhone = gql`
  mutation isExistMobilePhone($mobilePhone: CNPhoneNumber) {
    isExistMobilePhone(mobilePhone: $mobilePhone)
  }
`;

export const bindMobileForWechatGql = gql`
  mutation bindMobileOfWechat($input: ValentinoBindMoibleWechatInput) {
    valentino {
      bindMobileWechat(input: $input) {
        userErrors {
          code
          message
        }
      }
    }
  }
`;

// 登录接口
export const loginByAuthCodeGql = gql`
  mutation autoLoginWechat($input: String!) {
    miniProgramLogin(authCode: $input) {
      userErrors {
        code
        message
      }
      token
      customer {
        mobile
        openId
        unionId
        accountInfo {
          name
          firstName
          lastName
          localLastName
          localFirstName
          birthday
          genderType
          email
          address
          province
          city
          ext
        }
      }
    }
  }
`;

export const decryptDataGql = gql`
  mutation decryptData($encryptedData: String!, $iv: String!) {
    decryptData(encryptedData: $encryptedData, iv: $iv)
  }
`;

export const syncCrmMemberInfoGql = gql`
  mutation syncCrmMemberInfo {
    syncCrmMemberInfo
  }
`;

export const queryCustomerGql = gql`
  query queryCustomer {
    customer {
      mobile
      accountInfo {
        name
        firstName
        lastName
        localLastName
        localFirstName
        birthday
        genderType
        email
        address
        province
        city
        ext
        portrait
        nickname
      }
    }
  }
`;

export const sendSmsVerifyCodeGql = gql`
  mutation sendSmsVerifyCode($input: VerifyCodeInput!) {
    sendSmsVerifyCode(input: $input)
  }
`;

export const bindMobileByVerifyCodeGql = gql`
  mutation bindMobileByVerifyCode($input: VerifyCodeInput!) {
    bindMobileByVerifyCode(input: $input)
  }
`;

export const bindMobileByEncryptedDataGql = gql`
  mutation bindMobileByEncryptedData($encryptedData: String!, $iv: String!) {
    bindMobileByEncryptedData(encryptedData: $encryptedData, iv: $iv)
  }
`;

export const updateAccountInfoGql = gql`
  mutation lpAccountUpdate($input: AccountInfoInput!) {
    lpAccountUpdate(input: $input)
  }
`;

export const editAccountInfoGql = gql`
  mutation updateAccountInfo($input: AccountInfoInput!) {
    updateAccountInfo(input: $input)
  }
`;
export const queryAccountInfoGql = gql`
  query accountInfo {
    customer {
      mobile
      accountInfo {
        appellation
        firstName
        lastName
        birthday
        email
      }
    }
  }
`;
