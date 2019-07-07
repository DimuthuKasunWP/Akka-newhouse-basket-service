using Akka.Actor;
using NewhouseIT.BasketService.Products;

namespace NewhouseIT.BasketService.Baskets
{
    public class BasketsActorProvider
    {
        private IActorRef BasketsActorInstance { get; set; }

        public BasketsActorProvider(ActorSystem actorSystem, ProductsActorProvider provider)
        {
            var productsActor = provider.Get();
            this.BasketsActorInstance = actorSystem.ActorOf(BasketsActor.Props(productsActor), "baskets");
        }

        public IActorRef Get()
        {
            return this.BasketsActorInstance;
        }
    }
}
