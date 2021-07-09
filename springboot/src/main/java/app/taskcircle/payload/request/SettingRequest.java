package app.taskcircle.payload.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SettingRequest {
    private String tokenId;
    private String setting;
}
