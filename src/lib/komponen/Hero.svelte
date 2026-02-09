<script>
    const herotitle = "dapuromajayden";
    const herotagline = "Sarapan Pagi Biar Tidak Dimarahin Lambung";
</script>

<div class="container">
    <div class="jumbotron bg-light">
        <div class="container">
            <h1 class="font-weight-bolder oyen text-capitalize">{herotitle}</h1>
            <p class="lead text-capitalize">
                {herotagline}
            </p>
        </div>
    </div>
</div>

<style>
    .jumbotron {
        margin-top: 20px;
        border-radius: 10px;
    }
    @media (max-width: 576px) {
        .jumbotron {
            text-align: center;
        }
        h1 {
            font-size: 1.5rem;
        }
        p {
            font-size: 1rem;
        }
    }
</style>
