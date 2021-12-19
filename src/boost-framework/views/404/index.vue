<template>
    <!-- <div>404 - NOT FOUND</div> -->
    <div class="container pa-6">
        <div class="row">
            <div class="col-md-12">
                <div class="text-center ma-0">
                    <v-avatar size="96" color="grey lighten-3">
                        <v-icon size="72" color="#f00">mdi-traffic-light</v-icon>
                    </v-avatar>
                </div>
            </div>
            <div class="col-md-12">
                <div class="text-center">
                    <h1 class="red--text mb-3">
                        <span>Error 404</span>
                    </h1>
                    <h2>您所请求的页面地址不存在！ 您可以点击下面的按钮，返回主页</h2>
                    <br />
                    <a class="read_more" href="/#/desktop">Back to home</a>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.container {
    margin-top: 90px;
}
.container h1 {
    font-size: 50px;
    line-height: 55px;
}
</style>
