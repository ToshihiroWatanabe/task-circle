package app.taskcircle.service;

import org.springframework.stereotype.Service;

import app.taskcircle.mapper.UserMapper;
import app.taskcircle.model.User;

/**
 * ユーザーアカウントに関するサービスクラスです。
 */
@Service
public class UserService {

    private final UserMapper userMapper;

    public UserService(UserMapper userMapper) {
        this.userMapper = userMapper;
    }

    /**
     * トークンIDからユーザー情報を取得します。
     * 
     * @param tokenId トークンID
     * @return ユーザー情報
     */
    public User findByTokenId(String tokenId) {
        return userMapper.findByTokenId(tokenId);
    }

    /**
     * ユーザーを作成します。
     * 
     * @param user ユーザー情報
     * @return 成功した場合はtrue
     */
    public boolean create(User user) {
        return userMapper.create(user);
    }

    /**
     * ユーザー情報を更新します。
     * 
     * @param user ユーザー情報
     * @return 成功した場合はtrue
     */
    public boolean update(User user) {
        return userMapper.update(user);
    }

    /**
     * トークンIDとプロフィール画像のURLを更新します。
     * 
     * @param user ユーザー情報
     * @return 成功した場合はtrue
     */
    public boolean updateTokenId(User user) {
        return userMapper.updateTokenId(user);
    }

}
