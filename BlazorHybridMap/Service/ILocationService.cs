namespace BlazorHybridMap.Service
{
    public interface ILocationService
    {
        Task<LocationResponse> GetCurrentLocation();
    }

    public class LocationService : ILocationService
    {
        public async Task<LocationResponse> GetCurrentLocation()
        {
            var status = await Permissions.RequestAsync<Permissions.LocationWhenInUse>();
            if (status != PermissionStatus.Granted)
                throw new CustomAccessDeniedException("Access Denied");

            var location = await Geolocation.GetLocationAsync(new GeolocationRequest
            {
                DesiredAccuracy = GeolocationAccuracy.Best,
                Timeout = TimeSpan.FromSeconds(30),
                RequestFullAccuracy = true
            });
            if (location != null)
                return new LocationResponse(location.Latitude, location.Longitude);
            else
                return null!;
        }
    }

    public class CustomAccessDeniedException(string message) : Exception(message);
    public record LocationResponse(double Lat, double Lng);
}
