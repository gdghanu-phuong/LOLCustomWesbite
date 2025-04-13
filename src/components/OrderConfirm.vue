<template>
    <div class="confirmation">
        <div class="container content">
            <div class="row text-center">
                <div class="col-lg-12 col-md-12 col-sm-12">
                    <i class="tick fas fa-check-circle"></i>
                </div>
                <div class="col-lg-12 col-md-12 col-sm-12">
                    <h1>Order Successfully!</h1>
                    <p>Your order has been place and will arrive within 3-5 business days!<br> Return to shop page to continue shopping.</p>
                </div>
                <div class="col-lg-12 col-md-12 col-sm-12">
                    <button type="button" class="btn btn-primary" @click="returnBack">Continue <i class="fas fa-arrow-right"></i> </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default{
    name: "OrderConfirm",
    methods:{
        returnBack(){
            this.$router.push({name: "shop"});
        }
    }
}
</script>

<style scoped>
.tick{
    font-size: 100px;
}

</style>