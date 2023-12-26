using Afonsoft.Amadeus;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AmadeusLibrary.Util
{
    public class AmadeusService
    {
        public async Task<Amadeus> CreateAmadeusApiConnection()
        {
            Amadeus amadeus1 = Amadeus
               .Builder("QZGCr97woTVAkvi7SZnjruC2apUDsDiJ", "JoMgvUGJ0PxkfF73")
               .Build();
            return await Task.FromResult(amadeus1);
        }
    }
}
