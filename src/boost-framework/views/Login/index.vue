<template>
    <v-row no-gutters>
        <v-col cols="12" xl="6" lg="7" class="primary d-md-flex align-center justify-center">
            <v-container>
                <div class="pa-10">
                    <v-row class="justify-center">
                        <v-col cols="10" lg="8">
                            <div class="text-h4 white--text font-weight-medium pb-1">仓库管理及控制系统</div>
                            <div class="text-h5 white--text font-weight-medium">Warehouse Management and Control System</div>
                            <div class="text-body-1 my-6 white--text op-10 font-weight-regular text-justify">
                                仓库管理及控制系统是现代供应链管理的重要组成部分，能够实现各类仓储资源、设备的合理分配与高效利用。
                                利用条码技术、RFID技术对货物进行货位、批次、保质期、配送等实现电子标签管理，实现收货、发货、补货、集货、送货等各环节的规范化作业；
                                融合物联技术、地理信息技术构建库房沙盘，帮助管理者全面掌控仓储资源、设备和人员的状态，为科学调度提供精准信息；
                                借助手持终端实现任务驱动，提升仓储业务活动的全员参与度与协同能力；使用云计算、微服务等信息技术全方位集成数据、服务和流程，为企业提供更为完整的数据资产管理
                            </div>
                            <v-btn x-large outlined light link depressed class="text-capitalize mt-4 white--text" tag="a">了解更多</v-btn>
                        </v-col>
                    </v-row>
                </div>
            </v-container>
        </v-col>

        <v-col cols="12" xl="6" lg="5" class="d-flex align-center">
            <v-container>
                <div class="pa-10">
                    <v-row class="justify-sm-center justify-md-center justify-lg-start">
                        <v-col cols="10" xl="6" lg="9">
                            <div class="d-flex justify-center pb-4">
                                <v-avatar size="96" color="grey lighten-3">
                                    <v-icon size="72">mdi-account-tie</v-icon>
                                </v-avatar>
                            </div>
                            <div class="text-h4 primary--text text-darken-6 font-weight-medium pb-10">用户登录</div>
                            <v-form>
                                <v-text-field outlined label="用户名" prepend-inner-icon="mdi-account" v-model="loginForm.username" />
                                <v-text-field
                                    type="password"
                                    outlined
                                    label="密码"
                                    prepend-inner-icon="mdi-lock"
                                    append-icon="mdi-eye-off"
                                    v-model="loginForm.password"
                                />
                            </v-form>

                            <div class="d-block d-flex align-center">
                                <v-checkbox label="记住会话" class="pa-0 ma-0" hide-details v-model="loginForm.rememberMe" />
                                <a class="ml-auto"><label>找回密码</label></a>
                            </div>
                            <div class="py-6">
                                <v-btn block light color="error darken-2" class="text-capitalize" x-large :loading="logining" @click="onLogin">登录系统</v-btn>
                            </div>

                            <div class="d-block d-flex justify-center pt-6">
                                <label class="v-label">镇江市金舟软件有限责任公司 版权所有</label>
                            </div>
                        </v-col>
                    </v-row>
                </div>
            </v-container>
        </v-col>
    </v-row>
</template>

<script>
import _ from 'lodash';
import { mapGetters, mapActions } from 'vuex';

export default {
    data: () => ({
        loginForm: {
            username: 'luchao',
            password: 'luchao'
        },

        logining: false
    }),
    computed: {
        ...mapGetters('framework', ['loginedUrl', 'userLogined'])
    },
    methods: {
        ...mapActions('framework', ['login']),
        onLogin() {
            this.logining = true;
            this.login(this.loginForm).then(() => {
                this.$router.push({ path: _.get(this.$route.query, 'redirect', this.loginedUrl) });
                this.logining = false;
            });
        }
    }
};
</script>
