// ----------------------------------------------------------------------

function path(root, sublink) {
  return `${root}${sublink}`;
}

const ROOTS_AUTH = '/auth';
const ROOTS_DASHBOARD = '/dashboard';

// ----------------------------------------------------------------------

export const PATH_AUTH = {
  root: ROOTS_AUTH
};

export const PATH_PAGE = {
  page404: '/404'
};

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  general: {
    newReport: path(ROOTS_DASHBOARD, '/new'),
    reportList: path(ROOTS_DASHBOARD, '/list'),
    pdfPage: path(ROOTS_DASHBOARD, '/pdf')
  }
};

export const PATH_DOCS = 'https://docs-minimals.vercel.app/introduction';
