import apollo from '../apollo';
import { viewDataGql, cmsContentGql, cmsContentListGql } from '../gqls'

export const getViewData = (payload) => apollo.mutate({
  mutation: viewDataGql,
  variables: {
    input: payload,
  },
});


export const getCmsContent = (payload) => apollo.query({
  query: cmsContentGql,
  variables: {
    ...payload,
  },
})

export const getCmsContentListApi = (payload) => apollo.query({
  query: cmsContentListGql,
  variables: { ...payload }
})