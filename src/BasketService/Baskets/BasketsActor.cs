using Akka.Actor;

using NewhouseIT.BasketService.Core.Messaging;

namespace NewhouseIT.BasketService.Baskets
{
    public class BasketsActor : ReceiveActor
    {
        private IActorRef ProductActor { get; }

        public BasketsActor(IActorRef productActor)
        {
            this.ProductActor = productActor;

            ReceiveAny(m => {
                if (m is MessageWithCustomerId)
                {
                    var envelope = m as MessageWithCustomerId;
                    var basketActor = Context.Child(envelope.CustomerId.ToString()) is Nobody ?
                        Context.ActorOf(BasketActor.Props(this.ProductActor), envelope.CustomerId.ToString()) :
                        Context.Child(envelope.CustomerId.ToString());
                    basketActor.Forward(m);
                }
            });
        }
        public static Props Props(IActorRef productsActor)
        {
            return Akka.Actor.Props.Create(() => new BasketsActor(productsActor));
        }
    }
}
