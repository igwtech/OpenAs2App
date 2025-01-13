import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Dashboard from './components/Dashboard.vue';
import CertificatesAdmin from './components/CertificatesAdmin.vue';
import PartnersAdmin from './components/PartnersAdmin.vue';
import ConnectionsAdmin from './components/ConnectionsAdmin.vue';
import MessagesAdmin from './components/MessagesAdmin.vue';
import MessageDetail from './components/MessageDetail.vue';

const routes: Array<RouteRecordRaw> = [
    { path: '/', component: Dashboard, name: "Dashboard", meta: { sidemenu: true } },
    { path: '/partners', component: PartnersAdmin, name: "Partners", meta: { sidemenu: true }},
    { path: '/partner/:id', component: PartnersAdmin, name: "PartnerEditor", meta: { sidemenu: false } },
    { path: '/partnerships', component: ConnectionsAdmin, name: "Connections", meta: { sidemenu: true } },
    { path: '/partnership/:id', component: ConnectionsAdmin, name: "ConnectionEditor", meta: { sidemenu: false } },
    { path: '/certs', component: CertificatesAdmin, name: "Certificates", meta: { sidemenu: true } },
    { path: '/cert/:id', component: CertificatesAdmin, name: "CertificateEditor", meta: { sidemenu: false } },
    { path: '/messages', component: MessagesAdmin, name: "Messages", meta: { sidemenu: true }},
    { path: '/message/:id', component: MessageDetail, name: "MessageDetail", meta: { sidemenu: false }},
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
